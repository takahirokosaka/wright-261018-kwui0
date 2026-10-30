import { mkdir, writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { EditorView } from "@codemirror/view";
import { getCurrentFilePath } from "./save-file";
import { invoke } from "@tauri-apps/api/core";

async function pasteImage(view: EditorView, file: File) {
	const bytes = new Uint8Array(await file.arrayBuffer());

	const timestamp = new Date().toISOString().replace(/:/g, "-");
	const filename = `paste-${timestamp}.png`;

	const currentFilePath = getCurrentFilePath();

	if (!currentFilePath) {
		pasteAltText(
			view,
			"![Please save this document first so that your image can be located using a relative file path.]()",
		);
		return true;
	}

	const assetsSuffix = await invoke<string>("get_assets_suffix");

	// Absolute path for filesystem operations
	const defaultPath = currentFilePath.replace(/\.[^/.]+$/, assetsSuffix);

	await invoke("allow_document_directory", {
		filePath: currentFilePath,
	});

	await mkdir(defaultPath, {
		recursive: true,
	});

	// Save
	await writeFile(`${defaultPath}/${filename}`, bytes, {
		baseDir: BaseDirectory.AppData,
	});

	// Relative path for Markdown
	const documentDir = currentFilePath.substring(
		0,
		Math.max(
			currentFilePath.lastIndexOf("/"),
			currentFilePath.lastIndexOf("\\"),
		),
	);

	const relativeAssetsPath = defaultPath
		.slice(documentDir.length)
		.replace(/^[/\\]/, "./")
		.replace(/\\/g, "/");

	const markdown = `![Pasted image](<${relativeAssetsPath}/${filename}>)`;
	const { from, to } = view.state.selection.main;

	view.dispatch({
		changes: { from, to, insert: markdown },
		selection: { anchor: from + markdown.length },
		scrollIntoView: true,
	});
}

function pasteAltText(view: EditorView, text: string) {
	const { from, to } = view.state.selection.main;

	view.dispatch({
		changes: { from, to, insert: text },
		selection: { anchor: from + text.length },
	});
}

export const pasteImageHandler = EditorView.domEventHandlers({
	paste(event, view) {
		const items = Array.from(event.clipboardData?.items ?? []);
		const imageItem = items.find(
			(item) => item.kind === "file" && item.type.startsWith("image/"),
		);

		if (!imageItem) return false;

		event.preventDefault();

		if (imageItem.type !== "image/png") {
			pasteAltText(
				view,
				"![Quickly pasting screenshots is the main purpose of this feature, so only PNG images are supported. For other image formats, please drag and drop them from Finder.]()",
			);
			return true;
		}

		const file = imageItem.getAsFile();

		if (!file) return true;

		void pasteImage(view, file).catch(console.error);
		return true;
	},
});
