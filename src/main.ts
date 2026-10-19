import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

import { EditorView, minimalSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";

import "./styles.css";
import { saveMarkdownAs } from "./save-file";

console.debug("Window label:", getCurrentWindow().label);

async function loadUserCss() {
	try {
		const css = await invoke<string | null>("load_user_css");

		if (css) {
			const style = document.createElement("style");
			style.id = "user-styles";
			style.textContent = css;
			document.head.appendChild(style);
		}
	} catch (error) {
		console.error("Failed to load user CSS:", error);
	} finally {
		// Show the body after css is loaded.
		document.body.style.visibility = "visible";
	}
}

void loadUserCss();

const view = new EditorView({
	state: EditorState.create({
		doc: "",
		extensions: [minimalSetup, markdown()],
	}),
	parent: document.body,
});

// If simply listen (import { listen } from "@tauri-apps/api/event";), all editor windows respond to the event, even if window.emit_to is used. We don't know why.
/* const unlisten = */ await getCurrentWindow().listen("menu-save-as", () => {
	void saveMarkdownAs(view.state.doc.toString()).catch((error) => {
		alert(`Save As failed: ${String(error)}`);
	});
});
