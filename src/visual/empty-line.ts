import {
	Decoration,
	EditorView,
	ViewPlugin,
	ViewUpdate,
} from "@codemirror/view";

const emptyLineHighlight = Decoration.line({
	class: "cm-selected-empty-line",
});

export const emptyLineHighlightPlugin = ViewPlugin.fromClass(
	class {
		decorations;

		constructor(view: EditorView) {
			this.decorations = this.buildDecorations(view);
		}

		update(update: ViewUpdate) {
			if (update.selectionSet || update.docChanged) {
				this.decorations = this.buildDecorations(update.view);
			}
		}

		buildDecorations(view: EditorView) {
			const ranges = [];

			for (const range of view.state.selection.ranges) {
				if (range.empty) continue;

				const fromLine = view.state.doc.lineAt(range.from);
				const toLine = view.state.doc.lineAt(range.to);

				for (let n = fromLine.number; n <= toLine.number; n++) {
					const line = view.state.doc.line(n);

					if (line.text.length === 0) {
						ranges.push(emptyLineHighlight.range(line.from));
					}
				}
			}

			return Decoration.set(ranges, true);
		}
	},
	{
		decorations: (plugin) => plugin.decorations,
	},
);
