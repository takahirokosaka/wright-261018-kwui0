import { EditorView } from "codemirror";

export async function format(view: EditorView, formatType: string) {
	const { from, to } = view.state.selection.main;
	if (from === to) return;

	if (formatType === "bold") {
		const isBold =
			from >= 2 &&
			view.state.sliceDoc(from - 2, from) === "**" &&
			view.state.sliceDoc(to, to + 2) === "**";

		if (isBold) {
			view.dispatch({
				changes: [
					{ from: from - 2, to: from, insert: "" },
					{ from: to, to: to + 2, insert: "" },
				],
				selection: { anchor: from - 2, head: to - 2 },
			});
		} else {
			view.dispatch({
				changes: [
					{ from, insert: "**" },
					{ from: to, insert: "**" },
				],
				selection: { anchor: from + 2, head: to + 2 },
			});
		}
	}

	view.focus();
}
