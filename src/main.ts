declare global {
	interface Window {
		__INITIAL_FILE_PATH__?: string;
	}
}

import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

import { EditorView } from "codemirror";
import {
	indentOnInput,
	syntaxHighlighting,
	defaultHighlightStyle,
	bracketMatching,
} from "@codemirror/language";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { EditorState, Extension } from "@codemirror/state";
import { Compartment } from "@codemirror/state";
import { keymap, lineNumbers } from "@codemirror/view";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { searchKeymap } from "@codemirror/search";

import "./styles-default.css";
import "./styles-immutable.css";

import { registerMenuEvents } from "./menu";
import { updateWindowTitle } from "./window-title";
import { registerCloseConfirmation } from "./close-confirmation";
import { loadMarkdownFile } from "./save-file";

import { visual } from "./visual";
import { clickableUrl } from "./visual/clickable-url";
import { codeBlocklanguages } from "./visual/code-block";
import { highlightExtension } from "./visual/highlight";
import { trailingSpaces } from "./visual/trailing-spaces";
import { htmlBlockField } from "./visual/html-block";
import {
	insertTab,
	defaultKeymap,
	history,
	historyKeymap,
} from "@codemirror/commands";
import { exportHtml } from "./export-html";
import { displayMathField } from "./visual/math";
import { visualNewlineKeymap } from "./visual/newline";
import { setupFileDrop } from "./file-drop";
import { pasteMarkdown } from "./paste-markdown";
import { pasteImageHandler } from "./paste-image";

import sampleMd from "./sample.md?raw";

const currentWindow = getCurrentWindow();

console.debug("👋 Hi. Window label:", currentWindow.label);

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

const titleUpdateExtension = EditorView.updateListener.of((update) => {
	if (update.docChanged) {
		void updateWindowTitle(update.state.doc.toString());
	}
});

const initialPath = window.__INITIAL_FILE_PATH__;
const initialContent = initialPath
	? await loadMarkdownFile(initialPath)
	: import.meta.env.DEV
		? sampleMd
		: "";

const modeCompartment = new Compartment();

const sourceModeClass = EditorView.editorAttributes.of({
	class: "md-source-mode",
});

function modeExtensions(sourceMode: boolean) {
	const common: Extension[] = [
		markdown({
			base: markdownLanguage, // Language support for GFM plus subscript, superscript, and emoji syntax.
			extensions: [highlightExtension],
			codeLanguages: codeBlocklanguages,
		}),
		syntaxHighlighting(defaultHighlightStyle),
		indentOnInput(),
		bracketMatching(),
		closeBrackets(),
		trailingSpaces,
		pasteMarkdown,
		pasteImageHandler,
	];

	if (sourceMode) {
		return [lineNumbers(), sourceModeClass, ...common];
	}

	return [
		// The native spell checker doesn't work at least on macOS.
		EditorView.contentAttributes.of({
			spellcheck: "true",
			lang: "en-US",
		}),
		visual,
		clickableUrl,
		htmlBlockField,
		displayMathField,
		visualNewlineKeymap,
		...common,
	];
}

const view = new EditorView({
	state: EditorState.create({
		doc: initialContent,
		extensions: [
			// minimalSetup,
			EditorView.lineWrapping,
			closeBrackets(),
			keymap.of([
				{ key: "Tab", run: insertTab },
				// defaultKeymap, included in minimalSetup, causes cursor jumping around html blocks
				...defaultKeymap.filter(
					({ key }) => key !== "ArrowUp" && key !== "ArrowDown",
				),
				...historyKeymap,
				...closeBracketsKeymap,
				...searchKeymap,
			]),
			history(),
			titleUpdateExtension,
			modeCompartment.of(modeExtensions(false)),
		],
	}),
	parent: document.body,
});

await registerMenuEvents(view);

// Set the initial title.
void updateWindowTitle(view.state.doc.toString());

// Register the close confirmation handler.
/* const unlistenClose = */ await registerCloseConfirmation(() =>
	view.state.doc.toString(),
);

// Switch to the source mode.
/* const unlistenSourceMode = */ await getCurrentWindow().listen<boolean>(
	"menu-source-mode",
	(event) => {
		const sourceMode = event.payload;
		view.dispatch({
			effects: modeCompartment.reconfigure(modeExtensions(sourceMode)),
		});
	},
);

// Export HTML
await currentWindow.listen("export", async () => {
	exportHtml(view);
});

// Handle drag & drop from Finder
await setupFileDrop(view);

view.focus();

// A workaround for Tauri/macOS bug. See lib.rs.
if (currentWindow.label.startsWith("openfc-")) {
	currentWindow.emit("menu-open", true);
}
