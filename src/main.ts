import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

import { EditorView, minimalSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";

import "./styles.css";

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

new EditorView({
	state: EditorState.create({
		doc: "",
		extensions: [minimalSetup, markdown()],
	}),
	parent: document.body,
});
