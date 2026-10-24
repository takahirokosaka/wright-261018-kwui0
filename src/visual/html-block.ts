import { EditorState, StateField } from "@codemirror/state";
import { Range } from "@codemirror/state";

import { EditorView, Decoration, WidgetType } from "@codemirror/view";
import { syntaxTree, ensureSyntaxTree } from "@codemirror/language";
import DOMPurify from "dompurify";

const allowedBlockTags = new Set([
	"address",
	"article",
	"aside",
	"blockquote",
	"details",
	"dialog",
	"div",
	"dl",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"hr",
	"main",
	"nav",
	"ol",
	"p",
	"pre",
	"section",
	"table",
	"ul",
]);

const allowedInlineTags = new Set([
	"a",
	"b",
	"br",
	"code",
	"em",
	"i",
	"span",
	"strong",
	"sub",
	"sup",
	"u",
	"img",
]);

function isValidHtmlBlock(html: string): boolean {
	const allowedTags = new Set([...allowedBlockTags, ...allowedInlineTags]);

	const tags = html.matchAll(/<\/?([a-z][a-z0-9-]*)\b[^>]*>/gi);

	for (const match of tags) {
		if (!allowedTags.has(match[1].toLowerCase())) {
			return false;
		}
	}

	return true;
}

class HtmlBlockWidget extends WidgetType {
	readonly html: string;
	constructor(html: string) {
		super();
		this.html = html;
	}
	toDOM() {
		const el = document.createElement("div");
		el.className = "md-html-block";

		const sanitized = DOMPurify.sanitize(this.html);

		// Display <br> (<br> is an inline element but CodeMirror displays it as a block element if there's nothing else in the line) literally instead of rendering it as a line break.
		const html = sanitized.replace(
			/<br\b[^>]*\/?>/gi,
			'<span style="color: gray;">&lt;br&gt;</span>',
		);

		el.innerHTML = html;
		return el;
	}
}

let forcedFullParse = false;

function buildHtmlDecorations(state: EditorState) {
	const ranges: Range<Decoration>[] = [];

	let tree = syntaxTree(state);

	// Force the syntax tree to cover the whole document before collecting blocks.
	if (!forcedFullParse) {
		tree = ensureSyntaxTree(state, state.doc.length, 1000) ?? tree;
		forcedFullParse = true;
	}

	tree!.iterate({
		enter(node) {
			if (node.name !== "HTMLBlock") return;

			const html = state.doc.sliceString(node.from, node.to);

			if (!isValidHtmlBlock(html)) return;

			ranges.push(
				Decoration.replace({
					widget: new HtmlBlockWidget(
						state.doc.sliceString(node.from, node.to),
					),
					block: true,
				}).range(node.from, node.to),
			);
		},
	});
	return Decoration.set(ranges, true);
}

// HTML blocks are rendered as atomic elements. Switch to source mode to edit their contents.
export const htmlBlockField = StateField.define({
	create(state) {
		return buildHtmlDecorations(state);
	},
	update(decos, tr) {
		return tr.docChanged ? buildHtmlDecorations(tr.state) : decos;
	},
	provide: (field) => [
		EditorView.decorations.from(field),
		EditorView.atomicRanges.of((view) => view.state.field(field)),
	],
});
