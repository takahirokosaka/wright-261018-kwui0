import { basename } from "@tauri-apps/api/path";
import { save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

let currentFilePath: string | null = null;
let savedContent = "";

export function getCurrentFileName(): Promise<string> {
	return currentFilePath
		? basename(currentFilePath)
		: Promise.resolve("Untitled.md");
}

export function getSavedContent(): string {
	return savedContent;
}

export function setOpenedFile(path: string, content: string): void {
	currentFilePath = path;
	savedContent = content;
}

async function saveToPath(content: string, path: string): Promise<void> {
	await writeTextFile(path, content);
	currentFilePath = path;
	savedContent = content;
}

export async function saveMarkdown(content: string): Promise<void> {
	if (currentFilePath) {
		await saveToPath(content, currentFilePath);
		return;
	}

	// No file assigned yet: behave like Save As.
	await saveMarkdownAs(content);
}

export async function saveMarkdownAs(content: string): Promise<void> {
	const path = await save({
		defaultPath: currentFilePath ?? "Untitled.md",
		filters: [
			{
				name: "Markdown",
				extensions: ["md", "markdown"],
			},
		],
	});

	// The user cancelled the dialog.
	if (!path) return;

	await saveToPath(content, path);
}

export async function loadMarkdownFile(path: string): Promise<string> {
	const content = await readTextFile(path);
	currentFilePath = path;
	savedContent = content;
	return content;
}
