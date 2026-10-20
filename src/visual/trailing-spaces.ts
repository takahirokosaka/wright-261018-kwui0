import {
	ViewPlugin,
	Decoration,
	type EditorView,
	type ViewUpdate,
} from "@codemirror/view";

const spaceMark = Decoration.mark({ class: "md-trailing-space" });

export const trailingSpaces = ViewPlugin.fromClass(
	class {
		decorations;

		constructor(view: EditorView) {
			this.decorations = this.build(view);
		}

		update(update: ViewUpdate) {
			if (update.docChanged || update.viewportChanged) {
				this.decorations = this.build(update.view);
			}
		}

		build(view: EditorView) {
			const ranges = [];
			let pos = 0;

			for (const line of view.state.doc.iterLines()) {
				const trailing = line.match(/ +$/);

				if (trailing) {
					const from = pos + line.length - trailing[0].length;
					const to = pos + line.length;

					for (let p = from; p < to; p++) {
						ranges.push(spaceMark.range(p, p + 1));
					}
				}

				pos += line.length + 1;
			}

			return Decoration.set(ranges, true);
		}
	},
	{
		decorations: (plugin) => plugin.decorations,
	},
);
