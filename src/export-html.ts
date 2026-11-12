import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile, mkdir } from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";

import type { EditorView } from "@codemirror/view";
import { marked, Renderer } from "marked";

import postcss from "postcss";

import { highlightColors } from "./visual/highlight";
import defaultCss from "./styles-default.css?inline";

import { getCurrentFileName, getCurrentFilePath } from "./save-file";

declare global {
	interface Window {
		MathJax?: {
			startup: {
				promise: Promise<void>;
			};
			tex2svgPromise(
				formula: string,
				options: { display: boolean },
			): Promise<Node>;
		};
	}
}

function getFooterText(markdown: string): string | undefined {
	const match = markdown.match(
		/^---[ \t]*\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/,
	);

	if (!match) return undefined;

	const footerMatch = match[1].match(/^footer:[ \t]*(.*)$/m);

	if (!footerMatch) return undefined;

	return footerMatch[1].trim().replace(/^(['"])(.*)\1$/, "$2");
}

function escapeCssString(value: string): string {
	return value
		.replace(/\\/g, "\\\\")
		.replace(/"/g, '\\"')
		.replace(/[\n\r\f]/g, " ");
}

function stripFrontMatter(markdown: string): string {
	return markdown.replace(
		/^---[ \t]*\r?\n[\s\S]*?\r?\n(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/,
		"",
	);
}

async function mathToSvg(formula: string, display: boolean): Promise<string> {
	const mathJax = window.MathJax;

	if (!mathJax) {
		throw new Error("MathJax has not loaded");
	}

	await mathJax.startup.promise;

	const node = await mathJax.tex2svgPromise(formula, { display });

	return new XMLSerializer().serializeToString(node);
}

async function preRenderMath(markdown: string): Promise<Map<string, string>> {
	const regex = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
	const formulas = new Map<string, { formula: string; display: boolean }>();

	for (const match of markdown.matchAll(regex)) {
		const display = match[1] !== undefined;
		const formula = (match[1] ?? match[2]).trim();
		const key = `${display ? "display" : "inline"}:${formula}`;

		formulas.set(key, { formula, display });
	}

	const entries = await Promise.all(
		[...formulas.entries()].map(
			async ([key, { formula, display }]) =>
				[key, await mathToSvg(formula, display)] as const,
		),
	);

	return new Map(entries);
}

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => {
		const entities: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
		};

		return entities[char];
	});
}

function createAdmonitionExtension() {
	return {
		name: "admonition",
		level: "block" as const,

		start(src: string) {
			return src.search(/^:::(?:note|tip|info|warning|danger|caution)\b/im);
		},

		tokenizer(src: string) {
			const opening = src.match(
				/^:::(note|tip|info|warning|danger|caution)\b([^\n]*)\n/i,
			);

			if (!opening) return;

			const type = opening[1].toLowerCase();
			const customTitle = opening[2].trim();

			const lines = src.split("\n");
			let depth = 1;
			let closingIndex = -1;

			for (let i = 1; i < lines.length; i++) {
				const line = lines[i];

				if (/^:::(note|tip|info|warning|danger|caution)\b/i.test(line)) {
					depth++;
				} else if (/^:::[ \t]*$/.test(line)) {
					depth--;

					if (depth === 0) {
						closingIndex = i;
						break;
					}
				}
			}

			// Don't consume an unfinished admonition.
			if (closingIndex === -1) return;

			const raw = lines.slice(0, closingIndex + 1).join("\n");
			const text = lines.slice(1, closingIndex).join("\n");

			return {
				type: "admonition",
				raw,
				text,
				admonitionType: type,
				title: customTitle || type.charAt(0).toUpperCase() + type.slice(1),
			};
		},

		renderer(token: { text: string; admonitionType: string; title: string }) {
			// Parse the inner Markdown, including nested admonitions,
			// using the other registered Marked extensions.
			const content = marked.parse(token.text);

			return `<aside class="md-admonition md-admonition-${token.admonitionType}">
  <div class="md-admonition-title">${escapeHtml(token.title)}</div>
  <div class="md-admonition-content">${content}</div>
</aside>\n`;
		},
	};
}

export async function exportHtml(view: EditorView) {
	const defaultRenderer = new Renderer();

	const markdown = view.state.doc.toString();

	// get footer text
	const footerText = getFooterText(markdown);
	const footerCss =
		footerText === undefined
			? ""
			: `:root { --footer-text: "${escapeCssString(footerText)}"; }`;

	// remove front matter
	const content = stripFrontMatter(markdown);

	// Render all math, including formulas outside the viewport.
	const mathSvgs = await preRenderMath(content);

	marked.use({
		extensions: [
			createAdmonitionExtension(),
			{
				name: "math",
				level: "inline",
				start(src) {
					return src.indexOf("$");
				},
				tokenizer(src) {
					// Display math first, including multiline formulas.
					const displayMatch = src.match(/^\$\$([\s\S]+?)\$\$/);
					const inlineMatch = displayMatch
						? null
						: src.match(/^\$([^$\n]+?)\$/);

					if (!displayMatch && !inlineMatch) return;

					const display = displayMatch !== null;
					const formula = (display ? displayMatch![1] : inlineMatch![1]).trim();

					const key = `${display ? "display" : "inline"}:${formula}`;
					const svg = mathSvgs.get(key);

					if (svg === undefined) return;

					return {
						type: "math",
						raw: displayMatch?.[0] ?? inlineMatch![0],
						text: svg,
						display,
					};
				},
				renderer(token) {
					return token.display
						? `<div class="md-math-display">${token.text}</div>`
						: `<span class="md-math-inline">${token.text}</span>`;
				},
			},
			{
				name: "highlight",
				level: "inline",
				start(src) {
					return src.indexOf("==");
				},
				tokenizer(src) {
					const match = src.match(/^==(?:\{([a-z]+)\})?([\s\S]+?)==/);

					if (!match) return;

					return {
						type: "highlight",
						raw: match[0],
						text: match[2],
						color:
							highlightColors[match[1] ?? "yellow"] ?? highlightColors.yellow,
					};
				},
				renderer(token) {
					return `<mark style="background-color: ${token.color}; border-radius: 0.2em; padding: 0.1em 0.2em;">${token.text}</mark>`;
				},
			},
		],
		renderer: {
			code(token) {
				const html = defaultRenderer.code(token);
				const language = token.lang?.split(/\s+/)[0];

				if (!language) return html;

				const safeLanguage = language.replace(
					/[&"<']/g,
					(char) =>
						({
							"&": "&amp;",
							'"': "&quot;",
							"<": "&lt;",
							"'": "&#39;",
						})[char]!,
				);

				return html.replace("<pre>", `<pre data-language="${safeLanguage}">`);
			},
		},
	});

	const body = await marked.parse(content, { async: true });

	const filename = await getCurrentFileName();

	const loadedCss = getLoadedCss();

	const currentFilePath = getCurrentFilePath();

	const defaultPath = currentFilePath
		? currentFilePath.replace(/\.[^/.]+$/, ".html")
		: filename.replace(/\.[^/.]+$/, ".html");

	const path = await save({
		defaultPath,
		filters: [
			{
				name: "HTML",
				extensions: ["html"],
			},
		],
	});

	// User cancelled the dialog.
	if (!path) return;

	// Generate companion asset paths.
	const assetsDir = path.replace(/\.[^/.]+$/, ".assets");
	const sylesPath = `${assetsDir}/styles.css`;
	const cssHref = `./${assetsDir.split(/[\\/]/).pop()}/styles.css`;

	const html = `<!doctype html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <title>${path.split(/[\\/]/).pop()!}</title>
	<link rel="stylesheet" href="${cssHref}">
</head>
<body style="overflow: auto;">
<article>
${body}
</article>
</body>
</html>`;

	await mkdir(assetsDir, { recursive: true });
	await writeTextFile(sylesPath, `${loadedCss.css}\n${footerCss}`);
	await writeTextFile(path, html);

	// Copy fonts from the app's data dir to .assets/fonts
	await invoke("copy_fonts", {
		path,
		fonts: loadedCss.fonts,
	});

	return html;
}

function getLoadedCss(): { css: string; fonts: string[] } {
	const userCss = document.getElementById("user-styles")?.textContent ?? "";

	const css = [defaultCss, userCss].filter(Boolean).join("\n");

	const fonts = Array.from(
		css.matchAll(/wright:\/\/font\/([^"'()\s]+)/g),
		(match) => match[1],
	);

	const processedCss = css.replace(/wright:\/\/font\//g, "./fonts/");

	const root = postcss.parse(processedCss);
	deduplicateCss(root);

	return {
		css: root.toString(),
		fonts: [...new Set(fonts)],
	};
}

function deduplicateCss(root: postcss.Root): void {
	// Remove identical declarations within the same rule.
	root.walkRules((rule) => {
		const seenDeclarations = new Set<string>();

		rule.walkDecls((decl) => {
			const key = `${decl.prop}:${decl.value}:${decl.important}`;

			if (seenDeclarations.has(key)) {
				decl.remove();
			} else {
				seenDeclarations.add(key);
			}
		});
	});

	// Remove identical CSS rules, including repeated blocks.
	const seenRules = new Set<string>();

	root.walkRules((rule) => {
		const key = rule.toString();

		if (seenRules.has(key)) {
			rule.remove();
		} else {
			seenRules.add(key);
		}
	});
}
