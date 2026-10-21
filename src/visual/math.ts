import {
	EditorState,
	RangeSetBuilder,
	StateField,
	type Range,
} from "@codemirror/state";
import {
	Decoration,
	EditorView,
	WidgetType,
	type DecorationSet,
} from "@codemirror/view";

declare global {
	interface Window {
		MathJax?: {
			startup: {
				promise: Promise<void>;
			};
			tex2svgPromise(
				formula: string,
				options: { display: boolean },
			): Promise<Node>;
		};
	}
}

// Cache svg rendering. Otherwise the source text appears on every key event.
const mathCache = new Map<string, string>();

async function renderMath(formula: string, display: boolean): Promise<string> {
	const key = `${display ? "display" : "inline"}:${formula}`;

	const cached = mathCache.get(key);
	if (cached) return cached;

	await window.MathJax!.startup.promise;

	const node = await window.MathJax!.tex2svgPromise(formula, {
		display,
	});

	const svg = new XMLSerializer().serializeToString(node);
	mathCache.set(key, svg);

	return svg;
}

class MathWidget extends WidgetType {
	constructor(
		readonly formula: string,
		readonly displayMode: boolean,
	) {
		super();
	}

	toDOM(): HTMLElement {
		const element = document.createElement(this.displayMode ? "div" : "span");

		element.className = "md-math-widget";
		element.textContent = this.formula;

		void this.render(element);

		return element;
	}

	private async render(element: HTMLElement) {
		try {
			const svg = await renderMath(this.formula, this.displayMode);

			// The widget might have been removed while rendering.
			if (!element.isConnected) return;

			const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
			const node = doc.documentElement;

			element.replaceChildren(document.importNode(node, true));
		} catch (error) {
			console.error("Failed to render math:", error);
			element.textContent = this.formula;
		}
	}

	ignoreEvent() {
		return true;
	}
}

// For inline math
export function mathDecorations(view: EditorView): DecorationSet {
	const decorations: Range<Decoration>[] = [];
	const { state } = view;
	const selection = state.selection.main;

	for (const { from, to } of view.visibleRanges) {
		const text = state.doc.sliceString(from, to);
		const regex = /(?<!\$)\$([^$\n]+?)\$(?!\$)/g;

		let match: RegExpExecArray | null;

		while ((match = regex.exec(text)) !== null) {
			const start = from + match.index;
			const end = start + match[0].length;

			if (selection.from <= end && selection.to >= start) {
				continue;
			}

			decorations.push(
				Decoration.replace({
					widget: new MathWidget(match[1].trim(), false),
				}).range(start, end),
			);
		}
	}

	return Decoration.set(decorations, true);
}

// For display math
function buildDisplayMathDecorations(state: EditorState): DecorationSet {
	const builder = new RangeSetBuilder<Decoration>();
	const text = state.doc.toString();
	const selection = state.selection.main;

	const regex = /^[ \t]*\$\$([\s\S]*?)\$\$[ \t]*$/gm;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(text)) !== null) {
		const start = match.index;
		const end = start + match[0].length;

		// Keep the source editable when the selection touches it.
		if (selection.from <= end && selection.to >= start) {
			continue;
		}

		builder.add(
			start,
			end,
			Decoration.replace({
				widget: new MathWidget(match[1].trim(), true),
				block: true,
			}),
		);
	}

	return builder.finish();
}

export const displayMathField = StateField.define<DecorationSet>({
	create(state) {
		return buildDisplayMathDecorations(state);
	},

	update(decorations, transaction) {
		if (
			transaction.docChanged ||
			!transaction.startState.selection.eq(transaction.state.selection)
		) {
			return buildDisplayMathDecorations(transaction.state);
		}

		return decorations;
	},
	provide: (field) => EditorView.decorations.from(field),
});
