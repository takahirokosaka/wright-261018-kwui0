import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

async function greet() {
	if (greetMsgEl && greetInputEl) {
		// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
		greetMsgEl.textContent = await invoke("greet", {
			name: greetInputEl.value,
		});
	}
}

window.addEventListener("DOMContentLoaded", () => {
	greetInputEl = document.querySelector("#greet-input");
	greetMsgEl = document.querySelector("#greet-msg");
	document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
		e.preventDefault();
		greet();
	});
});

console.debug("Window label:", getCurrentWindow().label);

async function loadUserCss() {
	try {
		const css = await invoke<string | null>("load_user_css");

		if (css) {
			const style = document.createElement("style");
			style.id = "user-styles";
			style.textContent = css;
			document.head.appendChild(style);
		} else {
			await message("Please make a stylesheet file ~/.write.css", {
				title: "Stylesheet Not Found",
				kind: "warning",
			});
		}
	} catch (error) {
		console.error("Failed to load user CSS:", error);
	} finally {
		// Show the body after css is loaded.
		document.body.style.visibility = "visible";
	}
}

void loadUserCss();
