import { getCurrentWindow } from "@tauri-apps/api/window";
import type { EditorView } from "codemirror";

import { saveMarkdown, saveMarkdownAs } from "./save-file";
import { updateWindowTitle } from "./window-title";

export async function registerMenuEvents(view: EditorView) {
	// If we simply listen (import { listen } from "@tauri-apps/api/event";), all editor windows respond to the event, even if window.emit_to is used. We don't know why.
	const window = getCurrentWindow();

	const saveCurrent = async (saveAs: boolean) => {
		try {
			const content = view.state.doc.toString();

			if (saveAs) {
				await saveMarkdownAs(content);
			} else {
				await saveMarkdown(content);
			}

			await updateWindowTitle(view.state.doc.toString());
		} catch (error) {
			alert(`${saveAs ? "Save As" : "Save"} failed: ${String(error)}`);
		}
	};

	const unlistenSave = await window.listen("menu-save", () => {
		void saveCurrent(false);
	});

	const unlistenSaveAs = await window.listen("menu-save-as", () => {
		void saveCurrent(true);
	});

	// Return cleanup callbacks for when the editor is disposed. This is optional if your editor lives for the entire lifetime of its window, but it is useful if we recreate the editor view.
	return () => {
		unlistenSave();
		unlistenSaveAs();
	};
}
