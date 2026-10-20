import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";

const hideMark = Decoration.replace({});

export function inlineCodeDecorations(view: EditorView): DecorationSet {
	const decorations : Range<Decoration>[] = [];
	const tree = syntaxTree(view.state);

	const cursorLine = view.state.doc.lineAt(
		view.state.selection.main.head,
	).number;

	for (const { from, to } of view.visibleRanges) {
		tree.iterate({
			from,
			to,
			enter(node) {
				if (node.name !== "InlineCode") return;

				const line = view.state.doc.lineAt(node.from);
				if (line.number === cursorLine) return;

				// Hide the opening and closing backticks.
				const source = view.state.doc.sliceString(node.from, node.to);
				const match = source.match(/^(`+)([\s\S]*?)\1$/);
				if (!match) return;

				const delimiterLength = match[1].length;

				decorations.push(
					Decoration.mark({ class: "md-inline-code" }).range(
						node.from + delimiterLength,
						node.to - delimiterLength,
					),
					hideMark.range(node.from, node.from + delimiterLength),
					hideMark.range(node.to - delimiterLength, node.to),
				);
			},
		});
	}

	return Decoration.set(decorations, true);
}
