import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";

const hideMark = Decoration.replace({});

const emphasisClasses: Record<string, string> = {
	StrongEmphasis: "md-bold",
	Emphasis: "md-italic",
	Strikethrough: "md-strikethrough",
};

const markerNames = new Set(["EmphasisMark", "StrikethroughMark"]);

export function emphasisDecorations(view: EditorView): DecorationSet {
	const decorations: Range<Decoration>[] = [];
	const tree = syntaxTree(view.state);
	const selection = view.state.selection.main;

	for (const { from, to } of view.visibleRanges) {
		tree.iterate({
			from,
			to,
			enter(node) {
				const className = emphasisClasses[node.name];

				if (className) {
					decorations.push(
						Decoration.mark({ class: className }).range(node.from, node.to),
					);
				}

				if (!markerNames.has(node.name)) return;

				// Find the enclosing emphasis node.
				let parent = node.node.parent;
				while (parent && !emphasisClasses[parent.name]) {
					parent = parent.parent;
				}

				if (!parent) return;

				// Show both markers if the cursor touches either boundary.
				const cursorInsideMarkup =
					selection.from >= parent.from && selection.to <= parent.to;

				if (!cursorInsideMarkup) {
					decorations.push(hideMark.range(node.from, node.to));
				}
			},
		});
	}

	return Decoration.set(decorations, true);
}
