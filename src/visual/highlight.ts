import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";
import type { MarkdownConfig } from "@lezer/markdown";

const highlightDelimiter = {
	resolve: "Highlight",
	mark: "HighlightMark",
};

export const highlightExtension: MarkdownConfig = {
	defineNodes: [{ name: "Highlight" }, { name: "HighlightMark" }],
	parseInline: [
		{
			name: "Highlight",
			parse(cx, next, pos) {
				if (next !== 61 || cx.char(pos + 1) !== 61 || cx.char(pos + 2) === 61) {
					return -1;
				}

				return cx.addDelimiter(highlightDelimiter, pos, pos + 2, true, true);
			},
		},
	],
};

const allowedColors: Record<string, string> = {
	red: "#fecaca",
	orange: "#fed7aa",
	yellow: "#fef08a",
	green: "#bbf7d0",
	blue: "#bfdbfe",
	purple: "#e9d5ff",
	pink: "#fbcfe8",
	gray: "#999999",
};

const hideMark = Decoration.replace({});

export function highlightDecorations(view: EditorView): DecorationSet {
	const decorations: Range<Decoration>[] = [];
	const tree = syntaxTree(view.state);

	const selection = view.state.selection.main;

	for (const { from, to } of view.visibleRanges) {
		tree.iterate({
			from,
			to,
			enter(node) {
				if (node.name === "Highlight") {
					const text = view.state.doc.sliceString(node.from, node.to);
					const match = text.match(/^==\{([a-z]+)\}/);

					const cursorInsideMarkup =
						selection.from >= node.from && selection.to <= node.to;

					if (match && !cursorInsideMarkup) {
						decorations.push(
							hideMark.range(node.from, node.from + match[0].length),
						);
					}

					const color = match ? allowedColors[match[1]] : allowedColors.yellow;

					const contentFrom = match
						? node.from + match[0].length
						: node.from + 2;

					const contentTo = node.to - 2;

					if (color && contentFrom < contentTo) {
						decorations.push(
							Decoration.mark({
								attributes: {
									style: `background-color: ${color}; border-radius: 0.2em; padding:.1em .2em;`,
								},
							}).range(contentFrom, contentTo),
						);
					}
				}

				if (node.name === "HighlightMark") {
					// Find the enclosing Highlight node.
					let parent = node.node.parent;

					while (parent && parent.name !== "Highlight") {
						parent = parent.parent;
					}

					if (parent) {
						const cursorInsideMarkup =
							selection.from >= parent.from && selection.to <= parent.to;

						if (!cursorInsideMarkup) {
							decorations.push(hideMark.range(node.from, node.to));
						}
					}
				}
			},
		});
	}

	return Decoration.set(decorations, true);
}
