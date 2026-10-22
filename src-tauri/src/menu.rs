use std::sync::atomic::{AtomicBool, Ordering};
use std::{
	collections::{HashMap, HashSet},
	sync::Mutex,
};
use tauri::menu::Submenu;
use tauri::{
	AppHandle, Emitter, Listener, Manager, WindowEvent,
	menu::{CheckMenuItem, MenuItem},
};

pub struct MenuState {
	save: MenuItem<tauri::Wry>,
	save_as: MenuItem<tauri::Wry>,
	source_mode: CheckMenuItem<tauri::Wry>,
	focused_windows: Mutex<HashSet<String>>,
	source_mode_by_window: Mutex<HashMap<String, bool>>, // Lets each window retain its own Source Mode setting, even when another window gets focus.
	quitting: AtomicBool,
}

pub fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
	let open = MenuItem::with_id(app, "open", "Open…", true, Some("CmdOrCtrl+O"))?;

	let new_window = MenuItem::with_id(app, "new-editor", "New", true, Some("CmdOrCtrl+N"))?;

	let save = MenuItem::with_id(app, "save", "Save", true, Some("CmdOrCtrl+S"))?;

	let save_as = MenuItem::with_id(app, "save-as", "Save As…", true, Some("CmdOrCtrl+Shift+S"))?;

	let export = MenuItem::with_id(
		app,
		"export",
		"Export HTML",
		true,
		Some("CmdOrCtrl+Shift+E"),
	)?;

	// Tauri has documented issues with intercepting native Cmd+Q through its general application-exit event. Replacing the native Quit item gives your app a predictable menu event to handle. See the Tauri issue on macOS application termination. https://github.com/tauri-apps/tauri/issues/9198
	let quit = MenuItem::with_id(app, "quit", "Quit Write", true, Some("CmdOrCtrl+Q"))?;

	let bold = MenuItem::with_id(app, "format-bold", "Bold", true, Some("CmdOrCtrl+B"))?;

	let source_mode = CheckMenuItem::with_id(
		app,
		"source-mode",
		"Source Mode",
		true,
		false,
		Some("CmdOrCtrl+;"),
	)?;

	if let Some(menu) = app.menu() {
		let items = menu.items()?;

		for item in &items {
			if let Some(submenu) = item.as_submenu() {
				let submenu_text = submenu.text()?;

				if submenu_text == "File" {
					for file_item in submenu.items()? {
						if let Some(predefined) = file_item.as_predefined_menuitem() {
							if predefined.text()? == "Close Window" {
								predefined.set_text("Close")?;
							}
						}
					}

					// Prepend these in reverse order to have them above "Close"
					submenu.prepend(&export)?;
					submenu.prepend(&save_as)?;
					submenu.prepend(&save)?;
					submenu.prepend(&new_window)?;
					submenu.prepend(&open)?;
				}

				#[cfg(target_os = "macos")]
				if submenu_text == "Write" {
					// Replace the native Quit Write item with our custom item.
					for (index, app_item) in submenu.items()?.iter().enumerate() {
						if let Some(predefined) = app_item.as_predefined_menuitem() {
							if predefined.text()? == "Quit Write" {
								submenu.remove_at(index)?;
								submenu.append(&quit)?;
								break;
							}
						}
					}
				}

				if submenu_text == "View" {
					submenu.append(&source_mode)?;
				}
			}
		}

		let format_menu = Submenu::with_items(app, "Format", true, &[&bold])?;

		// Insert Format menu after Edit. TOOD: Windows and Linux
		menu.insert(&format_menu, 3)?;
	}

	let focused_windows = app
		.webview_windows()
		.values()
		.filter(|window| window.is_focused().unwrap_or(false))
		.map(|window| window.label().to_string())
		.collect();

	let source_mode_by_window = app
		.webview_windows()
		.keys()
		.map(|label| (label.clone(), false))
		.collect();

	app.manage(MenuState {
		save,
		save_as,
		source_mode,
		focused_windows: Mutex::new(focused_windows),
		source_mode_by_window: Mutex::new(source_mode_by_window),
		quitting: AtomicBool::new(false),
	});

	update_enabled_state(app.app_handle());

	let handle = app.handle().clone();

	app.listen("quit-cancelled", move |_| {
		handle
			.state::<MenuState>()
			.quitting
			.store(false, Ordering::SeqCst);
	});

	Ok(())
}

fn update_enabled_state(app: &AppHandle) {
	let state = app.state::<MenuState>();

	let focused_label = state.focused_windows.lock().unwrap().iter().next().cloned();

	let enabled = focused_label.is_some();

	let source_mode_enabled = focused_label
		.as_ref()
		.and_then(|label| {
			state
				.source_mode_by_window
				.lock()
				.unwrap()
				.get(label)
				.copied()
		})
		.unwrap_or(false);

	let _ = state.save.set_enabled(enabled);
	let _ = state.save_as.set_enabled(enabled);
	let _ = state.source_mode.set_enabled(enabled);
	let _ = state.source_mode.set_checked(source_mode_enabled);
}

pub fn handle_window_event(app: &AppHandle, label: &str, event: &WindowEvent) {
	let state = app.state::<MenuState>();

	match event {
		WindowEvent::Focused(true) => {
			state
				.focused_windows
				.lock()
				.unwrap()
				.insert(label.to_string());
		}
		WindowEvent::Focused(false) => {
			state.focused_windows.lock().unwrap().remove(label);
		}
		WindowEvent::Destroyed => {
			state.focused_windows.lock().unwrap().remove(label);
			state.source_mode_by_window.lock().unwrap().remove(label);

			if state.quitting.load(Ordering::SeqCst) && app.webview_windows().is_empty() {
				app.exit(0);
				return;
			}
		}
		_ => return,
	}

	update_enabled_state(app);
}

pub fn handle_event(app: &AppHandle, event: tauri::menu::MenuEvent) {
	let focused = app
		.webview_windows()
		.into_values()
		.find(|window| window.is_focused().unwrap_or(false));

	match event.id().as_ref() {
		"open" => {
			if let Some(window) = focused {
				let _ = window.emit_to(window.label(), "menu-open", ());
			}
		}
		"new-editor" => {
			let _ = crate::editor_window::create_editor_window_without_file(app);
		}
		"save" | "save-as" => {
			if let Some(window) = focused {
				let event_name = if event.id().as_ref() == "save" {
					"menu-save"
				} else {
					"menu-save-as"
				};
				let _ = window.emit_to(window.label(), event_name, ());
			}
		}
		"export" => {
			if let Some(window) = focused {
				let _ = window.emit_to(window.label(), "export", ());
			}
		}
		"quit" => {
			let windows = app.webview_windows();

			if windows.is_empty() {
				app.exit(0);
				return;
			}

			app.state::<MenuState>()
				.quitting
				.store(true, Ordering::SeqCst);

			for window in app.webview_windows().values() {
				// let _ = window.emit("confirm-quit", ());
				let _ = window.close();
			}
		}
		"source-mode" => {
			if let Some(window) = focused {
				let label = window.label().to_string();

				let state = app.state::<MenuState>();

				let enabled = {
					let mut modes = state.source_mode_by_window.lock().unwrap();
					let mode = modes.entry(label.clone()).or_insert(false);
					*mode = !*mode;
					*mode
				};

				let _ = window.emit_to(window.label(), "menu-source-mode", enabled);

				update_enabled_state(app);

				// TODO: have the frontend report its actual Source Mode state back to Rust when it changes, rather than relying exclusively on toggling the stored boolean.
			}
		}
		"format-bold" => {
			if let Some(window) = focused {
				let _ = window.emit_to(window.label(), "format", "bold");
			}
		}
		_ => {}
	}
}
