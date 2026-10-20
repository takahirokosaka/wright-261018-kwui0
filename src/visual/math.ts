import { type Range } from "@codemirror/state";
import {
	Decoration,
	EditorView,
	WidgetType,
	type DecorationSet,
} from "@codemirror/view";
import "katex/dist/katex.min.css";
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

export function mathDecorations(view: EditorView): DecorationSet {
	const decorations: Range<Decoration>[] = [];
	const { state } = view;
	const selection = state.selection.main;

	for (const { from, to } of view.visibleRanges) {
		const text = state.doc.sliceString(from, to);
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

			decorations.push(
				Decoration.replace({
					widget: new MathWidget(formula, displayMode),
					block: displayMode,
				}).range(start, end),
			);
		}
	}

	return Decoration.set(decorations, true);
}
