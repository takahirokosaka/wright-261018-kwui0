import { getCurrentWindow } from "@tauri-apps/api/window";
import type { EditorView } from "codemirror";

import { saveMarkdownAs } from "./save-file";

export async function registerMenuEvents(view: EditorView) {
	// If we simply listen (import { listen } from "@tauri-apps/api/event";), all editor windows respond to the event, even if window.emit_to is used. We don't know why.
	/* const unlisten = */ await getCurrentWindow().listen("menu-save-as", () => {
		void saveMarkdownAs(view.state.doc.toString()).catch((error) => {
			alert(`Save As failed: ${String(error)}`);
		});
	});
}
