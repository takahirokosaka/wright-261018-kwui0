import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";

import type { EditorView } from "@codemirror/view";
import { marked, Renderer } from "marked";

import { highlightColors } from "./visual/highlight";
 import appCss from "./styles-immutable.css?inline"; // Only html and body matter. Marked.js doesn't know CodeMirror styles.

 import { getCachedMathSvg } from "./visual/math";
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

async function mathToSvg(formula: string, display: boolean): Promise<string> {
	// Reuse SVGs already rendered by the editor.
	const cached = getCachedMathSvg(formula.trim(), display);
	if (cached) {
		console.debug("Math svg cache hit");
		return cached;
	}

	const mathJax = window.MathJax;

	if (!mathJax) {
		throw new Error("MathJax has not loaded");
	}

	await mathJax.startup.promise;

	const node = await mathJax.tex2svgPromise(formula, { display });

	return new XMLSerializer().serializeToString(node);
}

async function preRenderMath(markdown: string): Promise<void> {
	const regex = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
	const formulas = new Map<string, { formula: string; display: boolean }>();

	for (const match of markdown.matchAll(regex)) {
		const display = match[1] !== undefined;
		const formula = (match[1] ?? match[2]).trim();
		const key = `${display ? "display" : "inline"}:${formula}`;

		formulas.set(key, { formula, display });
	}

	await Promise.all(
		[...formulas.values()].map(({ formula, display }) =>
			mathToSvg(formula, display),
		),
	);
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

					if (displayMatch) {
						const formula = displayMatch[1].trim();
						const cached = getCachedMathSvg(formula, true);

						if (cached) {
							return {
								type: "math",
								raw: displayMatch[0],
								text: cached,
								display: true,
							};
						}

						return;
					}

					const inlineMatch = src.match(/^\$([^$\n]+?)\$/);

					if (!inlineMatch) return;

					const formula = inlineMatch[1].trim();
					const cached = getCachedMathSvg(formula, false);

					if (!cached) return;

					return {
						type: "math",
						raw: inlineMatch[0],
						text: cached,
						display: false,
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

	const markdown = view.state.doc.toString();

	await preRenderMath(markdown);

	const body = await marked.parse(markdown, { async: true });

	const filename = await getCurrentFileName();

	const html = `<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${filename}</title>
	<style>
		${getLoadedCss()}
	</style>
</head>
<body style="overflow: auto;">
${body}
</body>
</html>`;

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

	await writeTextFile(path, html);

	return html;
}

function getLoadedCss(): string {
	const userCss = document.getElementById("user-styles")?.textContent ?? "";

	return [appCss, userCss].join("\n");
}
