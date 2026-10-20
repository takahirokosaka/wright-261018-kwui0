import { getCurrentWindow } from "@tauri-apps/api/window";
import { confirm } from "@tauri-apps/plugin-dialog";
import { emit } from "@tauri-apps/api/event";

import { getSavedContent } from "./save-file";

export async function registerCloseConfirmation(
	getCurrentContent: () => string,
): Promise<() => void> {
	const window = getCurrentWindow();

	// Imagine the user rapidly clicks the window's close button several times. Without this flag, multiple dialogs might be triggered for the same window.
	let confirming = false;

	const unlisten = await window.onCloseRequested(async (event) => {
		const hasUnsavedChanges = getCurrentContent() !== getSavedContent();

		if (!hasUnsavedChanges) {
			return;
		}

		// Keep the window open while confirmation is pending.
		event.preventDefault();

		if (confirming) return;
		confirming = true;

		try {
			const shouldClose = await confirm(
				"Are you sure you want to discard unsaved changes?",
				{
					title: "Unsaved Changes",
					kind: "warning",
					okLabel: "Discard",
					cancelLabel: "Cancel",
				},
			);

			if (shouldClose) {
				await window.destroy();
			} else {
				await emit("quit-cancelled");
			}
		} catch (error) {
			console.error("Close confirmation failed:", error);
		} finally {
			confirming = false;
		}
	});

	return unlisten;
}
