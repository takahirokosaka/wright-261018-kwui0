import { RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { isAbsolute, dirname, resolve } from "@tauri-apps/api/path";
import { openUrl, openPath } from "@tauri-apps/plugin-opener";
import { getCurrentFilePath } from "../save-file";

const hideMark = Decoration.replace({});
const linkMark = Decoration.mark({ class: "md-link" });

export function urlDecorations(view: EditorView): DecorationSet {
	const builder = new RangeSetBuilder<Decoration>();
	const tree = syntaxTree(view.state);

	const cursor = view.state.selection.main.head;

	for (const { from, to } of view.visibleRanges) {
		tree.iterate({
			from,
			to,
			enter(node) {
				if (node.name !== "Link") return;

				const line = view.state.doc.lineAt(node.from);
				const cursorOnLine = cursor >= line.from && cursor <= line.to;

				if (cursorOnLine) return;

				const children: { name: string; from: number; to: number }[] = [];

				for (
					let child = node.node.firstChild;
					child;
					child = child.nextSibling
				) {
					children.push({
						name: child.name,
						from: child.from,
						to: child.to,
					});
				}

				const urlNode = children.find((child) => child.name === "URL");
				const marks = children.filter((child) => child.name === "LinkMark");

				if (!urlNode || marks.length < 3) return;

				// Hide the opening "[".
				builder.add(node.from, node.from + 1, hideMark);

				// Style the link label.
				builder.add(marks[0].to, marks[1].from, linkMark);

				// Hide everything from the closing label marker through ')'.
				builder.add(marks[1].from, node.to, hideMark);
			},
		});
	}

	return builder.finish();
}

function findUrlAt(view: EditorView, pos: number): string | null {
	const tree = syntaxTree(view.state);

	for (const bias of [-1, 1] as const) {
		let node = tree.resolveInner(pos, bias);

		while (node) {
			if (node.name === "Link") {
				for (let child = node.firstChild; child; child = child.nextSibling) {
					if (child.name === "URL") {
						return view.state.doc.sliceString(child.from, child.to);
					}
				}

				break;
			}

			if (!node.parent) break;
			node = node.parent;
		}
	}

	return null;
}

async function openMarkdownLink(href: string): Promise<void> {
	// Remove Markdown's optional angle-bracket delimiters. Wrapping a link destination in angle brackets (<...>) is a standard way to include spaces without percent-encoding them.
	const path =
		href.startsWith("<") && href.endsWith(">") ? href.slice(1, -1) : href;

	if (/^https?:\/\//i.test(path)) {
		await openUrl(path);
		return;
	}

	if (/^file:\/\//i.test(path)) {
		await openPath(decodeURIComponent(new URL(path).pathname));
		return;
	}

	if (await isAbsolute(path)) {
		await openPath(path);
		return;
	}

	const currentFile = getCurrentFilePath();

	if (!currentFile) {
		throw new Error("Cannot resolve relative link: no file is open.");
	}

	const directory = await dirname(currentFile);
	const targetPath = await resolve(directory, path);

	await openPath(targetPath);
}

export const clickableUrl = EditorView.domEventHandlers({
	mousedown(event, view) {
		if (!(event.ctrlKey || event.metaKey)) return false;

		const pos = view.posAtCoords({
			x: event.clientX,
			y: event.clientY,
		});

		if (pos == null) return false;

		console.log({
			pos,
			line: view.state.doc.lineAt(pos).text,
			node: syntaxTree(view.state).resolveInner(pos, 1).name,
		});

		const url = findUrlAt(view, pos);

		console.log(url);

		if (!url) return false;

		void openMarkdownLink(url).catch((error) => {
			console.error("Failed to open link:", error);
		});

		return true;
	},
});
