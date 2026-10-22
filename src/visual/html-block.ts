import { EditorState, StateField } from "@codemirror/state";
import { Range } from "@codemirror/state";

import { EditorView, Decoration, WidgetType } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import DOMPurify from "dompurify";

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

function buildHtmlDecorations(state: EditorState) {
	const ranges: Range<Decoration>[] = [];

	syntaxTree(state).iterate({
		enter(node) {
			if (node.name !== "HTMLBlock") return;

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
