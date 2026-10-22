import { EditorView } from "codemirror";

const FORMAT_TYPES = ["bold", "italic", "highlight", "mute", "underline"] as const;

type FormatType = (typeof FORMAT_TYPES)[number];

export function isFormatType(value: string): value is FormatType {
	return (FORMAT_TYPES as readonly string[]).includes(value);
}

const FORMAT_MARKERS: Record<FormatType, { open: string; close: string }> = {
	bold: { open: "**", close: "**" },
	italic: { open: "*", close: "*" },
	highlight: { open: "==", close: "==" },
	mute: { open: "=={gray}", close: "==" },
	underline: { open: "<u>", close: "</u>" },
};

export function format(view: EditorView, formatType: FormatType) {
	const { from, to } = view.state.selection.main;
	if (from === to) return;

	const { open, close } = FORMAT_MARKERS[formatType];
	const doc = view.state;

	const isFormatted =
		from >= open.length &&
		doc.sliceDoc(from - open.length, from) === open &&
		doc.sliceDoc(to, to + close.length) === close;

	if (isFormatted) {
		// Remove the surrounding markers.
		view.dispatch({
			changes: [
				{ from: from - open.length, to: from, insert: "" },
				{ from: to, to: to + close.length, insert: "" },
			],
			selection: {
				anchor: from - open.length,
				head: to - open.length,
			},
		});
	} else {
		// Add the surrounding markers.
		view.dispatch({
			changes: [
				{ from, insert: open },
				{ from: to, insert: close },
			],
			selection: {
				anchor: from + open.length,
				head: to + open.length,
			},
		});
	}

	view.focus();
}
