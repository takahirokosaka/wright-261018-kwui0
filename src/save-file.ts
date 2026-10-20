import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";

let currentFilePath: string | null = null;

async function saveToPath(content: string, path: string): Promise<void> {
	await writeTextFile(path, content);
	currentFilePath = path;
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
