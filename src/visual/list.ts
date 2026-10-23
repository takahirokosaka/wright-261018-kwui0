import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";
import { WidgetType } from "@codemirror/view";

const INDENT_SIZE = 2;

const hideMark = Decoration.replace({});

class ListMarker extends WidgetType {
	readonly marker: string;
	readonly depth: number;

	constructor(marker: string, depth: number) {
		super();
		this.marker = marker;
		this.depth = depth;
	}

	eq(other: ListMarker) {
		return this.marker === other.marker && this.depth === other.depth;
	}

	toDOM() {
		const span = document.createElement("span");

		span.className = [
			"md-list-marker",
			this.marker === "bullet"
				? "md-list-marker-bullet"
				: "md-list-marker-number",
			`md-list-depth-${this.depth}`,
		].join(" ");

		span.textContent = this.marker === "bullet" ? "" : `${this.marker}. `;

		return span;
	}
}

export function listDecorations(view: EditorView): DecorationSet {
	const decorations: Range<Decoration>[] = [];

	const cursorLine = view.state.doc.lineAt(
		view.state.selection.main.head,
	).number;

	for (const { from, to } of view.visibleRanges) {
		const startLine = view.state.doc.lineAt(from).number;
		const endLine = view.state.doc.lineAt(to).number;

		for (let lineNo = startLine; lineNo <= endLine; lineNo++) {
			const line = view.state.doc.line(lineNo);

			if (lineNo === cursorLine) continue;

			const match = line.text.match(/^( *)([-+*]|\d+[.)])\s+/);

			if (!match) continue;

			const markerFrom = line.from + match[1].length;
			const markerTo = line.from + match[0].length;
			const depth = Math.floor(match[1].length / INDENT_SIZE);

			const marker = /^\d/.test(match[2])
				? match[2].replace(/[.)]$/, "")
				: "bullet";

			decorations.push(hideMark.range(markerFrom, markerTo));

			decorations.push(
				Decoration.widget({
					widget: new ListMarker(marker, depth),
					side: -1,
				}).range(markerFrom),
			);
		}
	}

	return Decoration.set(decorations, true);
}
