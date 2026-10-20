use std::{collections::HashSet, sync::Mutex};
use tauri::{AppHandle, Emitter, Manager, WindowEvent, menu::MenuItem};

pub struct MenuState {
	save: MenuItem<tauri::Wry>,
	save_as: MenuItem<tauri::Wry>,
	focused_windows: Mutex<HashSet<String>>,
}

pub fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
	let new_window = MenuItem::with_id(app, "new-editor", "New", true, Some("CmdOrCtrl+N"))?;

	let save = MenuItem::with_id(app, "save", "Save", true, Some("CmdOrCtrl+S"))?;

	let save_as = MenuItem::with_id(app, "save-as", "Save As…", true, Some("CmdOrCtrl+Shift+S"))?;

	if let Some(menu) = app.menu() {
		let items = menu.items()?;

		for item in &items {
			if let Some(file_menu) = item.as_submenu() {
				if file_menu.text()? == "File" {
					// Change the original predefined menu item's label
					for file_item in file_menu.items()? {
						if let Some(predefined) = file_item.as_predefined_menuitem() {
							if predefined.text()? == "Close Window" {
								predefined.set_text("Close")?;
							}
						}
					}

					// Prepend these in reverse order to have them above "Close"
					file_menu.prepend(&save_as)?;
					file_menu.prepend(&save)?;
					file_menu.prepend(&new_window)?;
					break;
				}
			}
		}
	}

	let focused_windows = app
		.webview_windows()
		.values()
		.filter(|window| window.is_focused().unwrap_or(false))
		.map(|window| window.label().to_string())
		.collect();

	app.manage(MenuState {
		save,
		save_as,
		focused_windows: Mutex::new(focused_windows),
	});

	update_enabled_state(app.app_handle());

	Ok(())
}

fn update_enabled_state(app: &AppHandle) {
	let state = app.state::<MenuState>();
	let enabled = !state.focused_windows.lock().unwrap().is_empty();

	let _ = state.save.set_enabled(enabled);
	let _ = state.save_as.set_enabled(enabled);
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
		WindowEvent::Focused(false) | WindowEvent::Destroyed => {
			state.focused_windows.lock().unwrap().remove(label);
		}
		_ => return,
	}

	update_enabled_state(app);
}

pub fn handle_event(app: &AppHandle, event: tauri::menu::MenuEvent) {
	match event.id().as_ref() {
		"new-editor" => {
			let _ = crate::windows::create_editor_window(app);
		}
		"save" | "save-as" => {
			let focused = app
				.webview_windows()
				.into_values()
				.find(|window| window.is_focused().unwrap_or(false));

			if let Some(window) = focused {
				let event_name = if event.id().as_ref() == "save" {
					"menu-save"
				} else {
					"menu-save-as"
				};
				let _ = window.emit_to(window.label(), event_name, ());
			}
		}
		_ => {}
	}
}
