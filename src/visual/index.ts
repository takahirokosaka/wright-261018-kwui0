// A shared helper for loading decorations.

import { RangeSetBuilder } from "@codemirror/state";
import {
	ViewPlugin,
	type Decoration,
	type DecorationSet,
	type EditorView,
	type ViewUpdate,
} from "@codemirror/view";

import { headingDecorations } from "./headings";
import { urlDecorations } from "./clickable-url";
import { codeBlockDecorations } from "./code-block";
import { emphasisDecorations } from "./emphasis";
import { highlightDecorations } from "./highlight";
import { horizontalRuleDecorations } from "./horizontal-rule";
import { inlineCodeDecorations } from "./inline-code";
import { listDecorations } from "./list";
import { quoteDecorations } from "./quote";
import { htmlInlineDecorations } from "./html-inline";
import { imageDecorations } from "./image";
import { mathDecorations } from "./math";
import { emptyLineDecorations } from "./empty-line";
import { loadSpellChecker, spellCheckDecorations } from "./spell";

type MarkupHandler = (view: EditorView) => DecorationSet;

const spell = await loadSpellChecker();

const handlers: MarkupHandler[] = [
	headingDecorations,
	urlDecorations,
	codeBlockDecorations,
	emphasisDecorations,
	highlightDecorations,
	horizontalRuleDecorations,
	inlineCodeDecorations,
	listDecorations,
	quoteDecorations,
	htmlInlineDecorations,
	imageDecorations,
	mathDecorations,
	emptyLineDecorations,
	(view) => spellCheckDecorations(view, spell),
];

function buildDecorations(view: EditorView): DecorationSet {
	const ranges: {
		from: number;
		to: number;
		value: Decoration;
	}[] = [];

	for (const handler of handlers) {
		handler(view).between(0, view.state.doc.length, (from, to, value) => {
			ranges.push({ from, to, value });
		});
	}

	ranges.sort((a, b) => a.from - b.from || a.to - b.to);

	const builder = new RangeSetBuilder<Decoration>();

	for (const range of ranges) {
		builder.add(range.from, range.to, range.value);
	}

	return builder.finish();
}

export const visual = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = buildDecorations(view);
		}

		update(update: ViewUpdate) {
			if (update.docChanged || update.selectionSet || update.viewportChanged) {
				this.decorations = buildDecorations(update.view);
			}
		}
	},
	{
		decorations: (plugin) => plugin.decorations,
	},
);
