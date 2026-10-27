import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";

const frontMatterLine = Decoration.line({
	class: "md-frontmatter",
});

export function frontMatterDecorations(view: EditorView): DecorationSet {
	const doc = view.state.doc;
	const decorations: Range<Decoration>[] = [];

	if (doc.lines < 3 || doc.line(1).text !== "---") {
		return Decoration.none;
	}

	for (let lineNo = 1; lineNo <= doc.lines; lineNo++) {
		const line = doc.line(lineNo);

		decorations.push(frontMatterLine.range(line.from));

		if (lineNo > 1 && (line.text === "---" || line.text === "...")) {
			break;
		}
	}

	return Decoration.set(decorations, true);
}
