import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
	WidgetType,
} from "@codemirror/view";

class EmptyLineWidget extends WidgetType {
	toDOM() {
		const span = document.createElement("span");
		span.className = "md-empty-line";
		span.textContent = "·";
		return span;
	}

	ignoreEvent() {
		return true;
	}
}

const emptyLineWidget = Decoration.widget({
	widget: new EmptyLineWidget(),
	side: -1,
});

export function emptyLineDecorations(view: EditorView): DecorationSet {
	const decorations: Range<Decoration>[] = [];

	const cursorLine = view.state.doc.lineAt(
		view.state.selection.main.head,
	).number;

	for (const { from, to } of view.visibleRanges) {
		const startLine = view.state.doc.lineAt(from).number;
		const endLine = view.state.doc.lineAt(to).number;

		for (let i = startLine; i <= endLine; i++) {
			const line = view.state.doc.line(i);

			if (line.length === 0 && line.number !== cursorLine) {
				decorations.push(emptyLineWidget.range(line.from));
			}
		}
	}

	return Decoration.set(decorations, true);
}
