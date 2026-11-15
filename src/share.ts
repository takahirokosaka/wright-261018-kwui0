import { readFile, readDir, writeFile } from "@tauri-apps/plugin-fs";
import JSZip from "jszip";

import type { EditorView } from "@codemirror/view";

import { exportHtml } from "./export-html";

function joinPath(...parts: string[]): string {
	const separator = parts[0].includes("\\") ? "\\" : "/";

	return parts.map((part) => part.replace(/[\\/]+$/, "")).join(separator);
}

async function addDirectoryToZip(
	zip: JSZip,
	directoryPath: string,
	zipPath: string,
): Promise<void> {
	const entries = await readDir(directoryPath);

	for (const entry of entries) {
		// Skip macOS metadata and hidden files.
		if (entry.name === ".DS_Store" || entry.name.startsWith("._")) {
			continue;
		}

		const filePath = joinPath(directoryPath, entry.name);
		const entryPath = `${zipPath}/${entry.name}`;

		if (entry.isDirectory) {
			await addDirectoryToZip(zip, filePath, entryPath);
		} else {
			const contents = await readFile(filePath);
			zip.file(entryPath, contents);
		}
	}
}

export async function shareDocument(view: EditorView) {
	// Export HTML first.
	const result = await exportHtml(view, {
		showSuccess: false,
	});

	if (!result) return;

	const { markdownPath, htmlPath, assetsDir } = result;

	const filename = markdownPath.split(/[\\/]/).pop()!.replace(/\.md$/i, "");

	const directory = markdownPath.replace(/[\\/][^\\/]+$/, "");
	const zipPath = joinPath(directory, `${filename}.zip`);

	const zip = new JSZip();

	// Original Markdown.
	zip.file(`${filename}.md`, await readFile(markdownPath));

	// Exported HTML.
	zip.file(`${filename}.html`, await readFile(htmlPath));

	// Companion assets.
	zip.folder(`${filename}.assets`);

	await addDirectoryToZip(zip, assetsDir, `${filename}.assets`);

	// Generate archive.
	const zipData = await zip.generateAsync({
		type: "uint8array",
		compression: "DEFLATE",
		compressionOptions: {
			level: 6,
		},
	});

	await writeFile(zipPath, zipData);

	alert(`Created ${filename}.zip`);

	return zipPath;
}
