import { RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { openUrl } from "@tauri-apps/plugin-opener";

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
	let url: string | null = null;

	tree.iterate({
		from: pos,
		to: pos,
		enter(node) {
			if (node.name !== "Link") return;

			for (let child = node.node.firstChild; child; child = child.nextSibling) {
				if (child.name === "URL") {
					url = view.state.doc.sliceString(child.from, child.to);
					break;
				}
			}
		},
	});

	return url;
}

export const clickableUrl = EditorView.domEventHandlers({
	mousedown(event, view) {
		if (!(event.ctrlKey || event.metaKey)) return false;

		const pos = view.posAtCoords({
			x: event.clientX,
			y: event.clientY,
		});

		if (pos == null) return false;

		const url = findUrlAt(view, pos);

		if (!url) return false;

		void openUrl(url).catch((error) => {
			console.error("Failed to open URL:", error);
		});

		return true;
	},
});
