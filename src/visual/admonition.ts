import {
	Decoration,
	type DecorationSet,
	EditorView,
	WidgetType,
} from "@codemirror/view";
import { type Range } from "@codemirror/state";

class AdmonitionLabelWidget extends WidgetType {
	constructor(
		readonly label: string,
		readonly isClosing = false,
	) {
		super();
	}

	toDOM() {
		const span = document.createElement("span");

		if (this.isClosing) {
			span.className = "md-admonition-end";
			span.setAttribute("aria-hidden", "true");
		} else {
			span.className = "md-admonition-label";
			span.textContent = this.label;
		}

		return span;
	}

	eq(other: AdmonitionLabelWidget) {
		return this.label === other.label && this.isClosing === other.isClosing;
	}
}

const admonitionLine = (type: string) =>
	Decoration.line({
		class: `md-admonition-line md-admonition-${type}`,
	});

export function admonitionDecorations(view: EditorView): DecorationSet {
	const { state } = view;
	const decorations: Range<Decoration>[] = [];

	const cursorLine = state.doc.lineAt(state.selection.main.head).number;

	let opening:
		| {
				line: number;
				from: number;
				type: string;
				title: string;
		  }
		| undefined;

	for (let number = 1; number <= state.doc.lines; number++) {
		const line = state.doc.line(number);
		const text = line.text;

		if (!opening) {
			const match = text.match(
				/^(\s*):::[ \t]*(note|tip|info|warning|danger|caution)\b(?:[ \t]+(.*?))?[ \t]*$/i,
			);

			if (!match) continue;

			opening = {
				line: number,
				from: line.from + match[1].length,
				type: match[2].toLowerCase(),
				title:
					match[3]?.trim() ||
					match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase(),
			};

			continue;
		}

		// A closing fence is a line containing :::.
		if (/^\s*:::[ \t]*$/.test(text)) {
			const openingLine = state.doc.line(opening.line);
			const closingLine = line;

			if (cursorLine !== opening.line) {
				decorations.push(
					Decoration.replace({
						widget: new AdmonitionLabelWidget(opening.title),
					}).range(opening.from, openingLine.to),
				);
			}

			if (cursorLine !== number) {
				decorations.push(
					Decoration.replace({
						widget: new AdmonitionLabelWidget("", true),
					}).range(closingLine.from, closingLine.to),
				);
			}

			for (let n = opening.line; n <= number; n++) {
				decorations.push(
					admonitionLine(opening.type).range(state.doc.line(n).from),
				);
			}

			opening = undefined;
		}
	}

	return Decoration.set(decorations, true);
}
