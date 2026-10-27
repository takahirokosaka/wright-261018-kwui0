import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";
import Typo from "typo-js";

const spellError = Decoration.mark({
	class: "md-spell-error",
});

export async function loadSpellChecker() {
	const base = import.meta.env.BASE_URL;

	// https://wordlist.aspell.net/dicts/
	const [affResponse, dicResponse] = await Promise.all([
		fetch(`${base}dictionaries/en_US/en_US-large.aff`),
		fetch(`${base}dictionaries/en_US/en_US-large.dic`),
	]);

	if (!affResponse.ok || !dicResponse.ok) {
		throw new Error("Failed to load spell-check dictionary");
	}

	const [aff, dic] = await Promise.all([
		affResponse.text(),
		dicResponse.text(),
	]);

	return new Typo("en_US", aff, dic);
}

export function spellCheckDecorations(
	view: EditorView,
	spell: Typo,
): DecorationSet {
	const decorations: Range<Decoration>[] = [];

	// support English alphabetic characters and accented Latin characters (such as café)
	const wordRegex =
		/[\p{Script=Latin}\p{M}]+(?:['’][\p{Script=Latin}\p{M}]+)*/gu;

		const cursorLine = view.state.doc.lineAt(
		view.state.selection.main.head,
	).number;

	for (const { from, to } of view.visibleRanges) {
		const startLine = view.state.doc.lineAt(from).number;
		const endLine = view.state.doc.lineAt(to).number;

		for (let lineNo = startLine; lineNo <= endLine; lineNo++) {
			if (lineNo === cursorLine) continue;

			const line = view.state.doc.line(lineNo);
			const text = line.text;

			if (/^\s*(```|~~~)/.test(text)) continue;

			const masked = text
				.replace(/(`+).*?\1/g, (s) => " ".repeat(s.length))
				.replace(/https?:\/\/\S+/g, (s) => " ".repeat(s.length));

			for (const match of masked.matchAll(wordRegex)) {
				const word = match[0];

				if (spell.check(word)) continue;

				const start = line.from + match.index!;
				decorations.push(spellError.range(start, start + word.length));
			}
		}
	}

	return Decoration.set(decorations, true);
}
