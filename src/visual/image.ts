import { syntaxTree } from "@codemirror/language";
import {
	Decoration,
	WidgetType,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";
import { Range } from "@codemirror/state";

import { convertFileSrc } from "@tauri-apps/api/core";
import { dirname, resolve, isAbsolute } from "@tauri-apps/api/path";
import { getCurrentFilePath } from "../save-file";

class ImageWidget extends WidgetType {
	readonly url: string;
	readonly alt: string;

	constructor(url: string, alt: string) {
		super();
		this.url = url;
		this.alt = alt;
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

			void (async () => {
				if (await isAbsolute(this.url)) {
					img.src = convertFileSrc(this.url);
				} else if (markdownPath) {
					img.src = await resolveImageUrl(markdownPath, this.url);
				}
			})();
		}
		img.alt = this.alt.length > 0 ? this.alt : this.url;
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
				let altNode: { from: number; to: number } | undefined;

				node.node.cursor().iterate((child) => {
					if (child.name === "URL") {
						urlNode = { from: child.from, to: child.to };
					} else if (child.name === "LinkLabel") {
						altNode = { from: child.from, to: child.to };
					}
				});

				if (!urlNode) return;

				let url = view.state.doc.sliceString(urlNode.from, urlNode.to);

				// CodeMirror include Markdown's destination delimiters.
				if (url.startsWith("<") && url.endsWith(">")) {
					url = url.slice(1, -1);
				}

				const alt = altNode
					? view.state.doc.sliceString(altNode.from, altNode.to)
					: "";

				decorations.push(
					Decoration.replace({ widget: new ImageWidget(url, alt) }).range(
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
