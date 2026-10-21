import { syntaxTree } from "@codemirror/language";
import {
	Decoration,
	WidgetType,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";
import { Range } from "@codemirror/state";

import { convertFileSrc } from "@tauri-apps/api/core";
import { dirname, resolve } from "@tauri-apps/api/path";
import { getCurrentFilePath } from "../save-file";

// Ignore alt text
class ImageWidget extends WidgetType {
	readonly url: string;

	constructor(url: string) {
		super();
		this.url = url;
	}

	eq(other: ImageWidget) {
		return this.url === other.url;
	}

	toDOM() {
		const img = document.createElement("img");
		img.className = "md-image";
		if (/^https?:\/\//i.test(this.url)) {
			img.src = this.url;
		} else {
			const markdownPath = getCurrentFilePath();

			if (markdownPath) {
				void resolveImageUrl(markdownPath, this.url).then((resolved) => {
					console.log(resolved);
					img.src = resolved;
				});
			}
		}
		img.alt = "image here";
		img.loading = "lazy";
		return img;
	}
}

export function imageDecorations(view: EditorView): DecorationSet {
	const decorations: Range<Decoration>[] = [];
	const tree = syntaxTree(view.state);

	const cursorLine = view.state.doc.lineAt(
		view.state.selection.main.head,
	).number;

	for (const { from, to } of view.visibleRanges) {
		tree.iterate({
			from,
			to,
			enter(node) {
				if (node.name !== "Image") return;

				const line = view.state.doc.lineAt(node.from);

				// Show Markdown source on the active line.
				if (line.number === cursorLine) return;

				let urlNode: { from: number; to: number } | undefined;

				node.node.cursor().iterate((child) => {
					if (child.name === "URL") {
						urlNode = { from: child.from, to: child.to };
					}
				});

				if (!urlNode) return;

				let url = view.state.doc.sliceString(urlNode.from, urlNode.to);

				// CodeMirror include Markdown's destination delimiters.
				if (url.startsWith("<") && url.endsWith(">")) {
					url = url.slice(1, -1);
				}

				decorations.push(
					Decoration.replace({ widget: new ImageWidget(url) }).range(
						node.from,
						node.to,
					),
				);
			},
		});
	}

	return Decoration.set(decorations, true);
}

async function resolveImageUrl(
	markdownPath: string,
	imagePath: string,
): Promise<string> {
	const baseDir = await dirname(markdownPath);
	const absolutePath = await resolve(baseDir, imagePath);
	return convertFileSrc(absolutePath);
}
