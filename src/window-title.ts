import { getCurrentWindow } from "@tauri-apps/api/window";

import { getCurrentFileName, getSavedContent } from "./save-file";
import { marked } from "marked";

export async function updateWindowTitle(currentContent: string): Promise<void> {
	const currentFileName = await getCurrentFileName();
	const hasUnsavedChanges = currentContent !== getSavedContent();

	const text = currentContent.trim();
	const wordCount = countRenderedWords(text);

	const title =
		`${currentFileName}${hasUnsavedChanges ? " *" : ""}` +
		` (${wordCount} words)`;

	await getCurrentWindow().setTitle(title);
}

// TODO: converting all content on every change is inefficient.
function countRenderedWords(markdown: string): number {
	const html = marked.parse(markdown, { async: false });

	const element = document.createElement("div");
	element.innerHTML = html;

	const text = element.textContent ?? "";

	// Match https? URLs as single words.
	const normalized = text.replace(
		/https?:\/\/[^\s]+/gi,
		" URL "
	);

	// Counts sequences of letters. "Don't Stop" -> 2, not 3.
	return normalized.match(/\b[\p{L}\p{N}]+(?:['’][\p{L}]+)*/gu)?.length ?? 0;
}
