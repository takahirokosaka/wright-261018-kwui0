import { syntaxTree } from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
	WidgetType,
} from "@codemirror/view";
import DOMPurify from "dompurify";

class HtmlInlineWidget extends WidgetType {
	constructor(readonly html: string) {
		super();
	}

	eq(other: HtmlInlineWidget) {
		return this.html === other.html;
	}

	toDOM() {
		const wrapper = document.createElement("span");
		wrapper.className = "md-html-inline";
		wrapper.innerHTML = DOMPurify.sanitize(this.html);
		return wrapper;
	}
}

const inlineHtmlRegex =
	/<span\b[^>]*>[\s\S]*?<\/span\s*>|<img\b[^>]*\/?>|<sub\b[^>]*>[\s\S]*?<\/sub\s*>|<sup\b[^>]*>[\s\S]*?<\/sup\s*>/gi;

const excludedNodes = new Set([
	"HTMLBlock",
	"FencedCode",
	"CodeBlock",
	"InlineCode",
	"CodeMark",
]);

export function htmlInlineDecorations(view: EditorView): DecorationSet {
	const { state } = view;
	const ranges: Range<Decoration>[] = [];
	const excluded: { from: number; to: number }[] = [];

	syntaxTree(state).iterate({
		enter(node) {
			if (excludedNodes.has(node.name)) {
				excluded.push({ from: node.from, to: node.to });
			}
		},
	});

	const activeLine = state.doc.lineAt(state.selection.main.head).number;

	for (const { from, to } of view.visibleRanges) {
		const source = state.doc.sliceString(from, to);
		const regex = new RegExp(inlineHtmlRegex.source, inlineHtmlRegex.flags);

		let match: RegExpExecArray | null;

		while ((match = regex.exec(source)) !== null) {
			const start = from + match.index;
			const end = start + match[0].length;

			const startLine = state.doc.lineAt(start).number;
			const endLine = state.doc.lineAt(end).number;

			// Keep the HTML source visible while editing its line.
			if (activeLine >= startLine && activeLine <= endLine) {
				continue;
			}

			// Ignore HTML inside code or HTML blocks.
			if (excluded.some((range) => start < range.to && end > range.from)) {
				continue;
			}

			ranges.push(
				Decoration.replace({
					widget: new HtmlInlineWidget(match[0]),
				}).range(start, end),
			);
		}
	}

	return Decoration.set(ranges, true);
}
