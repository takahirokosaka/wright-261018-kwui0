import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";

let currentFilePath: string | null = null;

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

	await writeTextFile(path, content);

	currentFilePath = path;
}
