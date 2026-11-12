import { convertFileSrc } from "@tauri-apps/api/core";
import { readTextFile } from "@tauri-apps/plugin-fs";

let originalDocumentCss = "";

export async function loadDocumentStylesheet(markdownPath: string) {
	const assetsDir = markdownPath.replace(/\.[^/.\\]+$/, ".assets");
	const stylePath = `${assetsDir}/styles.css`;

	document.getElementById("document-styles")?.remove();

	try {
		originalDocumentCss = await readTextFile(stylePath);

		const previewCss = originalDocumentCss.replace(
			/url\(["']?\.\/fonts\/([^"')]+)["']?\)/g,
			(_, filename) =>
				`url("${convertFileSrc(`${assetsDir}/fonts/${filename}`)}")`,
		);

		const style = document.createElement("style");
		style.id = "document-styles";
		style.textContent = previewCss;

		const userStyles = document.getElementById("user-styles");

		if (userStyles) {
			userStyles.after(style);
		} else {
			document.head.appendChild(style);
		}
	} catch (error) {
		console.warn("Could not load document stylesheet:", error);
		originalDocumentCss = "";
	}
}

export function getOriginalDocumentCss(): string {
	return originalDocumentCss;
}
