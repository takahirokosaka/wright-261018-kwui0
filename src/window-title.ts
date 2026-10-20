import { getCurrentWindow } from "@tauri-apps/api/window";

import { getCurrentFileName, getSavedContent } from "./save-file";

export async function updateWindowTitle(currentContent: string): Promise<void> {
	const currentFileName = await getCurrentFileName();
	const hasUnsavedChanges = currentContent !== getSavedContent();

	const title = `${currentFileName}${hasUnsavedChanges ? " *" : ""}`;

	await getCurrentWindow().setTitle(title);
}
