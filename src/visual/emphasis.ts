import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";

const hideMark = Decoration.replace({});

const emphasisClasses: Record<string, string> = {
	StrongEmphasis: "md-bold",
	Emphasis: "md-italic",
	Strikethrough: "md-strikethrough",
};

const markerNames = new Set(["EmphasisMark", "StrikethroughMark"]);

export function emphasisDecorations(view: EditorView): DecorationSet {
	const decorations: Range<Decoration>[] = [];
	const tree = syntaxTree(view.state);

	const selection = view.state.selection.main;
	const cursorLine = view.state.doc.lineAt(selection.head).number;

	for (const { from, to } of view.visibleRanges) {
		tree.iterate({
			from,
			to,
			enter(node) {
				const className = emphasisClasses[node.name];

				if (className) {
					decorations.push(
						Decoration.mark({ class: className }).range(node.from, node.to),
					);
				}

				// Hide emphasis markers when the cursor is outside
				// the line containing the markup.
				if (
					markerNames.has(node.name) &&
					view.state.doc.lineAt(node.from).number !== cursorLine
				) {
					decorations.push(hideMark.range(node.from, node.to));
				}
			},
		});
	}

	return Decoration.set(decorations, true);
}
