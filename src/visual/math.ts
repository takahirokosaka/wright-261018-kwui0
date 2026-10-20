import "katex/dist/katex.min.css";

import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	EditorView,
	ViewPlugin,
	type DecorationSet,
	type ViewUpdate,
	WidgetType,
} from "@codemirror/view";
import katex from "katex";

class MathWidget extends WidgetType {
	readonly formula: string;
	readonly displayMode;

	constructor(formula: string, displayMode: boolean) {
		super();
		this.formula = formula;
		this.displayMode = displayMode;
	}

	toDOM() {
		const element = document.createElement(this.displayMode ? "div" : "span");

		element.className = "cm-math-widget";

		try {
			katex.render(this.formula, element, {
				displayMode: this.displayMode,
				throwOnError: false,
				trust: false,
			});
		} catch {
			element.textContent = this.formula;
		}

		return element;
	}

	ignoreEvent() {
		return true;
	}
}

function buildDecorations(view: EditorView): DecorationSet {
	const builder = new RangeSetBuilder<Decoration>();
	const { state } = view;
	const selection = state.selection.main;

	// Only process visible lines for efficiency.
	for (const { from, to } of view.visibleRanges) {
		const text = state.doc.sliceString(from, to);

		// Match display math before inline math.
		const regex = /^\$\$([\s\S]*?)\$\$|(?<!\$)\$([^$\n]+?)\$(?!\$)/gm;

		let match: RegExpExecArray | null;

		while ((match = regex.exec(text)) !== null) {
			const fullMatch = match[0];
			const start = from + match.index;
			const end = start + fullMatch.length;

			// Keep the source editable when the cursor is inside it.
			if (selection.from <= end && selection.to >= start) {
				continue;
			}

			const displayMode = match[1] !== undefined;
			const formula = (match[1] ?? match[2]).trim();

			builder.add(
				start,
				end,
				Decoration.replace({
					widget: new MathWidget(formula, displayMode),
					block: displayMode,
				}),
			);
		}
	}

	return builder.finish();
}

export const mathPreview = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = buildDecorations(view);
		}

		update(update: ViewUpdate) {
			if (update.docChanged || update.viewportChanged || update.selectionSet) {
				this.decorations = buildDecorations(update.view);
			}
		}
	},
	{
		decorations: (plugin) => plugin.decorations,
	},
);
