import { syntaxTree } from "@codemirror/language";
import { EditorSelection, Prec } from "@codemirror/state";
import { keymap, type EditorView } from "@codemirror/view";
import { insertNewlineAndIndent } from "@codemirror/commands";
import { SyntaxNode } from "@lezer/common";

const excludedBlocks = new Set([
	"Blockquote",
	"BulletList",
	"OrderedList",
	"ListItem",
	"FencedCode",
	"CodeBlock",
	"HTMLBlock",
	"Table",
]);

function isParagraphOrHeading(view: EditorView): boolean {
	const { state } = view;
	const line = state.doc.lineAt(state.selection.main.head);
	const tree = syntaxTree(state);

	let node: SyntaxNode | null = tree.resolveInner(line.from, 1);
	let allowed = false;

	while (node !== null) {
		if (excludedBlocks.has(node.name)) {
			return false;
		}

		if (node.name === "Paragraph" || /^ATXHeading[1-6]$/.test(node.name)) {
			allowed = true;
		}

		node = node.parent;
	}

	return allowed;
}

export const visualNewlineKeymap = Prec.highest(
	keymap.of([
		{
			key: "Enter",
			run(view) {
				if (!isParagraphOrHeading(view)) {
					return false;
				}

				view.dispatch(
					view.state.changeByRange((range) => ({
						changes: {
							from: range.from,
							to: range.to,
							insert: "\n\n",
						},
						range: EditorSelection.cursor(range.from + 2),
					})),
				);

				return true;
			},
		},
		{
			key: "Shift-Enter",
			run: insertNewlineAndIndent,
		},
	]),
);
