import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
} from "@codemirror/view";
import type { SyntaxNode } from "@lezer/common";

const hideMark = Decoration.replace({});

const quoteLine = (depth: number) =>
	Decoration.line({
		class: `md-blockquote md-blockquote-${depth}`,
	});

export function quoteDecorations(view: EditorView): DecorationSet {
	const decorations : Range<Decoration>[]= [];
	const tree = syntaxTree(view.state);

	for (const { from, to } of view.visibleRanges) {
		tree.iterate({
			from,
			to,
			enter(node) {
				if (node.name === "Blockquote") {
					const depth = getQuoteDepth(node.node);
					const startLine = view.state.doc.lineAt(node.from);
					const endLine = view.state.doc.lineAt(node.to);

					for (
						let lineNo = startLine.number;
						lineNo <= endLine.number;
						lineNo++
					) {
						decorations.push(
							quoteLine(depth).range(view.state.doc.line(lineNo).from),
						);
					}
				}
				if (node.name === "QuoteMark") {
					const line = view.state.doc.lineAt(node.from);
					const cursorLine = view.state.doc.lineAt(
						view.state.selection.main.head,
					).number;

					if (line.number !== cursorLine) {
						// Hide ">"
						decorations.push(hideMark.range(node.from, node.to));

						// Hide the following space, if present
						if (view.state.doc.sliceString(node.to, node.to + 1) === " ") {
							decorations.push(hideMark.range(node.to, node.to + 1));
						}
					}
				}
			},
		});
	}

	return Decoration.set(decorations, true);
}

function getQuoteDepth(node: SyntaxNode): number {
	let depth = 0;

	for (
		let current: SyntaxNode | null = node;
		current;
		current = current.parent
	) {
		if (current.name === "Blockquote") depth++;
	}

	return depth;
}
