import { EditorView } from "codemirror";
import {
	hasHTML,
	hasRTF,
	hasText,
	readHTML,
	readRTF,
	readText,
} from "tauri-plugin-clipboard-x-api";
import TurndownService from "turndown";

const turndown = new TurndownService({
	headingStyle: "atx",
	bulletListMarker: "-",
	codeBlockStyle: "fenced",
});

async function readClipboardAsMarkdown(): Promise<string> {
	if (await hasHTML()) {
		const html = await readHTML();
		if (html) return turndown.turndown(html);
	}

	if (await hasRTF()) {
		const rtf = await readRTF();
		if (rtf) {
			// TODO: Convert RTF to HTML or Markdown with an RTF parser.
		}
	}

	if (await hasText()) {
		return await readText();
	}

	return "";
}

export const pasteMarkdown = EditorView.domEventHandlers({
	paste(event, view) {
		// Only intercept when clipboard data contains rich text.
		const html = event.clipboardData?.getData("text/html");
		// const rtf = event.clipboardData?.getData("text/rtf");

		if (!html /*&& !rtf*/) {
			// Preserve CodeMirror's normal plain-text paste behavior.
			return false;
		}

		// Must happen before the async operation.
		event.preventDefault();

		// Capture the selection before awaiting.
		const selection = view.state.selection;

		void (async () => {
			try {
				const markdown = await readClipboardAsMarkdown();

				if (!markdown) return;

				// Insert at the selection that existed when paste began.
				view.dispatch({
					changes: selection.ranges.map((range) => ({
						from: range.from,
						to: range.to,
						insert: markdown,
					})),
					selection: {
						anchor: selection.main.from + markdown.length,
					},
					scrollIntoView: true,
				});
			} catch (error) {
				console.error("HTML/rich-text paste failed:", error);
			}
		})();

		return true;
	},
});
