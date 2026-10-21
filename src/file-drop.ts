import { getCurrentWebview } from "@tauri-apps/api/webview";
import { dirname, relative, sep } from "pathe";
import type { EditorView } from "@codemirror/view";

import { getCurrentFilePath } from "./save-file";

export async function setupFileDrop(view: EditorView) {
	const unlisten = await getCurrentWebview().onDragDropEvent(async (event) => {
		if (event.payload.type !== "drop") return;

		const currentFilePath = getCurrentFilePath();

		const paths = await Promise.all(
			event.payload.paths.map(async (path) => {
				const filename = path.split("/").pop() ?? path;

				const relativePath = currentFilePath
					? getRelativePath(dirname(currentFilePath), path)
					: path;

				return `[${filename}](<${relativePath}>)`;
			}),
		);

		const markdown = paths.join("\n");
		const pos = view.state.selection.main.head;

		view.dispatch({
			changes: { from: pos, insert: markdown + "\n" },
			selection: { anchor: pos + markdown.length + 1 },
		});

		view.focus();
	});

	return unlisten;
}

function getRelativePath(from: string, to: string): string {
	const path = relative(from, to).split(sep).join("/");

	if (!path) return "./";

	return path.startsWith(".") ? path : `./${path}`;
}
