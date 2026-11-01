import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";

const quoteClasses: Record<string, string> = {
	"‘": "md-single-quote-open",
	"’": "md-single-quote-close",
	"“": "md-double-quote-open",
	"”": "md-double-quote-close",
};

const quoteMarks = Object.fromEntries(
	Object.entries(quoteClasses).map(([char, className]) => [
		char,
		Decoration.mark({ class: className }),
	]),
);

const quotePattern = /[‘’“”]/g;

export function curlyQuoteDecorations(view: EditorView): DecorationSet {
	const decorations: Range<Decoration>[] = [];

	for (const { from, to } of view.visibleRanges) {
		const text = view.state.doc.sliceString(from, to);

		for (const match of text.matchAll(quotePattern)) {
			const pos = from + match.index!;
			const decoration = quoteMarks[match[0]];

			decorations.push(decoration.range(pos, pos + 1));
		}
	}

	return Decoration.set(decorations, true);
}
