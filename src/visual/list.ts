import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";
import { WidgetType } from "@codemirror/view";

const hideMark = Decoration.replace({});

class ListMarker extends WidgetType {
	readonly marker: string;

	constructor(marker: string) {
		super();
		this.marker = marker;
	}

	eq(other: ListMarker) {
		return this.marker === other.marker;
	}

	toDOM() {
		const span = document.createElement("span");
		span.className =
			this.marker === "bullet"
				? "md-list-marker md-list-marker-bullet"
				: "md-list-marker md-list-marker-number";

		span.textContent = this.marker === "bullet" ? "" : `${this.marker}. `;

		return span;
	}
}

export function listDecorations(view: EditorView): DecorationSet {
	const decorations: Range<Decoration>[] = [];
	const tree = syntaxTree(view.state);

	const cursorLine = view.state.doc.lineAt(
		view.state.selection.main.head,
	).number;

	for (const { from, to } of view.visibleRanges) {
		tree.iterate({
			from,
			to,
			enter(node) {
				const isBullet = node.name === "BulletList";
				const isOrdered = node.name === "OrderedList";

				if (!isBullet && !isOrdered) return;

				// Find the list marker at the start of each list item.
				node.node.cursor().iterate((child) => {
					if (child.name !== "ListMark" && child.name !== "ListItem") {
						return;
					}

					if (child.name === "ListItem") {
						const itemLine = view.state.doc.lineAt(child.from);

						// Only show Markdown source for the active item.
						if (itemLine.number === cursorLine) return;

						const itemText = view.state.doc.sliceString(
							itemLine.from,
							itemLine.to,
						);

						const match = itemText.match(/^(\s*)([-+*]|\d+[.)])\s+/);

						if (match) {
							const markerFrom = itemLine.from + match[1].length;
							const markerTo = itemLine.from + match[0].length;

							decorations.push(hideMark.range(markerFrom, markerTo));

							if (isBullet) {
								decorations.push(
									Decoration.widget({
										widget: new ListMarker("bullet"),
										side: -1,
									}).range(markerFrom),
								);
							} else {
								const number = match[2].replace(/[.)]$/, "");

								decorations.push(
									Decoration.widget({
										widget: new ListMarker(number),
										side: -1,
									}).range(markerFrom),
								);
							}
						}
					}
				});
			},
		});
	}

	return Decoration.set(decorations, true);
}
