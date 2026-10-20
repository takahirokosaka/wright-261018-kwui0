import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";

const hideMark = Decoration.replace({});
const ruleLine = Decoration.line({
	class: "md-horizontal-rule",
});

export function horizontalRuleDecorations(view: EditorView): DecorationSet {
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
				if (node.name !== "HorizontalRule") return;

				const startLine = view.state.doc.lineAt(node.from);
				const endLine = view.state.doc.lineAt(node.to);

				for (
					let lineNo = startLine.number;
					lineNo <= endLine.number;
					lineNo++
				) {
					const line = view.state.doc.line(lineNo);

					if (lineNo === cursorLine) continue;

					decorations.push(ruleLine.range(line.from));
					decorations.push(hideMark.range(line.from, line.to));
				}
			},
		});
	}

	return Decoration.set(decorations, true);
}
