import { getCurrentWindow } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import type { Event } from "@tauri-apps/api/event";

import type { EditorView } from "codemirror";
import { undoDepth } from "@codemirror/commands";

import { saveMarkdown, saveMarkdownAs, setOpenedFile } from "./save-file";
import { updateWindowTitle } from "./window-title";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { format, isFormatType } from "./format";
import { loadDocumentStylesheet } from "./document-styles";

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

	const unlistenOpen = await window.listen<boolean>(
		"menu-open",
		async (event: Event<boolean>) => {
			const closeWindowIfCanceled = event.payload;

			try {
				const path = await open({
					multiple: false,
					filters: [
						{
							name: "Markdown",
							extensions: ["md", "mdx", "markdown"],
						},
					],
				});

				if (!path || Array.isArray(path)) {
					if (closeWindowIfCanceled) {
						await window.close();
					}
					return;
				}

				// If the current window is not a genuinely new, empty editor, don't reuse it.
				const hasContent = view.state.doc.length > 0;
				const hasUndoHistory = undoDepth(view.state) > 0;

				if (hasContent || hasUndoHistory) {
					await invoke("open_markdown_in_new_window", { path });
					return;
				}

				const content = await readTextFile(path);

				setOpenedFile(path, content);

				await loadDocumentStylesheet(path);

				view.dispatch({
					changes: {
						from: 0,
						to: view.state.doc.length,
						insert: content,
					},
				});

				await updateWindowTitle(content);
			} catch (error) {
				alert(`Open failed: ${String(error)}`);
			}
		},
	);

	const unlistenFormat = await window.listen<string>("format", (event) => {
		if (isFormatType(event.payload)) {
			void format(view, event.payload);
		}
	});

	const unlistenHelp = await window.listen("help", async () => {
		await invoke("open_markdown_in_new_window", { path: "demo" });
	});

	// Return cleanup callbacks for when the editor is disposed. This is optional if your editor lives for the entire lifetime of its window, but it is useful if we recreate the editor view.
	return () => {
		unlistenSave();
		unlistenSaveAs();
		unlistenOpen();
		unlistenFormat();
		unlistenHelp();
	};
}
