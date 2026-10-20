import {
	ViewPlugin,
	type DecorationSet,
	type EditorView,
	type ViewUpdate,
} from "@codemirror/view";

import { RangeSetBuilder } from "@codemirror/state";

import { headingDecorations } from "./headings";

type MarkupHandler = (view: EditorView) => DecorationSet;

const handlers: MarkupHandler[] = [headingDecorations];

function buildDecorations(view: EditorView): DecorationSet {
	const ranges = handlers.flatMap((handler) => {
		const decorations = handler(view);
		const result: {
			from: number;
			to: number;
			value: import("@codemirror/view").Decoration;
		}[] = [];

		decorations.between(0, view.state.doc.length, (from, to, value) => {
			result.push({ from, to, value });
		});

		return result;
	});

	ranges.sort((a, b) => a.from - b.from || a.to - b.to);

	const builder = new RangeSetBuilder<import("@codemirror/view").Decoration>();

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
