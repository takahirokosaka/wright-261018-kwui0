import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";

import type { EditorView } from "@codemirror/view";
import { marked } from "marked";

import { highlightColors } from "./visual/highlight";
import appCss from "./styles.css?inline";

import { getCachedMathSvg } from "./visual/math";
import { getCurrentFileName } from "./save-file";

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

export async function exportHtml(view: EditorView) {
	marked.use({
		extensions: [
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
<body>
	<article class="exported-document">
		${body}
	</article>
</body>
</html>`;

	const path = await save({
		defaultPath: filename.replace(/\.[^/.]+$/, "") + ".html",
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
