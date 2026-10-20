import { javaLanguage } from "@codemirror/lang-java";
import { javascript, typescriptLanguage } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { rustLanguage } from "@codemirror/lang-rust";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import {
	LanguageDescription,
	LanguageSupport,
	StreamLanguage,
	syntaxTree,
} from "@codemirror/language";
import { type Range } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	EditorView,
	WidgetType,
} from "@codemirror/view";

const shellLanguage = StreamLanguage.define(shell);

const languages = [
	LanguageDescription.of({
		name: "JavaScript",
		alias: ["js", "jsx"],
		support: javascript(),
	}),
	LanguageDescription.of({
		name: "TypeScript",
		alias: ["ts", "tsx"],
		support: new LanguageSupport(typescriptLanguage),
	}),
	LanguageDescription.of({
		name: "Java",
		alias: ["java"],
		support: new LanguageSupport(javaLanguage),
	}),
	LanguageDescription.of({
		name: "Rust",
		alias: ["rs"],
		support: new LanguageSupport(rustLanguage),
	}),
	LanguageDescription.of({
		name: "Shell",
		alias: ["sh", "bash", "zsh", "shell"],
		support: new LanguageSupport(shellLanguage),
	}),
];

export const markdownSupport = markdown({
	codeLanguages: languages,
});

class FenceLabelWidget extends WidgetType {
	constructor(readonly label: string) {
		super();
	}

	toDOM() {
		const span = document.createElement("span");

		if (this.label === "__close__") {
			span.className = "md-code-fence-end";
			span.setAttribute("aria-hidden", "true");
		} else {
			span.className = "md-code-fence-label";
			span.textContent = this.label;
		}

		return span;
	}

	eq(other: FenceLabelWidget) {
		return this.label === other.label;
	}
}

const codeLine = Decoration.line({
	class: "md-code-block-line",
});

export function codeBlockDecorations(view: EditorView): DecorationSet {
	const state = view.state;
	const decorations: Range<Decoration>[] = [];

	const cursorLine = state.doc.lineAt(state.selection.main.head).number;

	syntaxTree(state).iterate({
		enter(node) {
			if (node.name !== "FencedCode") return;

			const { from, to } = node;
			const source = state.doc.sliceString(from, to);

			const match = source.match(
				/^(```+|~~~+)[^\n]*\n([\s\S]*?)\n[ \t]*(```+|~~~+)[ \t]*$/,
			);

			if (!match) return;

			const openingFenceLength = match[1].length;
			const openingLineEnd = source.indexOf("\n");
			const closingFenceLength = match[3].length;
			const closingFrom = to - closingFenceLength;

			const openingLine = state.doc.lineAt(from);
			const closingLine = state.doc.lineAt(closingFrom);

			const info = source.slice(openingFenceLength, openingLineEnd).trim();

			if (cursorLine !== openingLine.number) {
				decorations.push(
					Decoration.replace({
						widget: new FenceLabelWidget(info || ""),
					}).range(from, from + openingLineEnd),
				);
			}

			if (cursorLine !== closingLine.number) {
				decorations.push(
					Decoration.replace({
						widget: new FenceLabelWidget("__close__"),
					}).range(closingFrom, to),
				);
			}

			const firstCodeLine = state.doc.lineAt(node.from).number + 1;
			const lastCodeLine = state.doc.lineAt(node.to).number - 1;

			for (let number = firstCodeLine; number <= lastCodeLine; number++) {
				const line = state.doc.line(number);
				decorations.push(codeLine.range(line.from));
			}
		},
	});

	return Decoration.set(decorations, true);
}
