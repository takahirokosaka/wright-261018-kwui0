import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";

const headingClasses: Record<string, string> = {
	ATXHeading1: "md-h1",
	ATXHeading2: "md-h2",
	ATXHeading3: "md-h3",
	ATXHeading4: "md-h4",
	ATXHeading5: "md-h5",
	ATXHeading6: "md-h6",
};

const hideMark = Decoration.replace({});

export function headingDecorations(view: EditorView): DecorationSet {
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
				const className = headingClasses[node.name];
				if (!className) return;

				const line = view.state.doc.lineAt(node.from);

				decorations.push(
					Decoration.line({ class: className }).range(line.from),
				);

				if (line.number !== cursorLine) {
					const text = view.state.doc.sliceString(line.from, line.to);
					const match = text.match(/^#{1,6}\s+/);

					if (match) {
						decorations.push(
							hideMark.range(line.from, line.from + match[0].length),
						);
					}
				}
			},
		});
	}

	return Decoration.set(decorations, true);
}
