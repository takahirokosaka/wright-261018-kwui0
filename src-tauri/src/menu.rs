use std::sync::atomic::{AtomicBool, Ordering};
use std::{collections::HashSet, sync::Mutex};
use tauri::{AppHandle, Emitter, Listener, Manager, WindowEvent, menu::MenuItem};

pub struct MenuState {
	save: MenuItem<tauri::Wry>,
	save_as: MenuItem<tauri::Wry>,
	focused_windows: Mutex<HashSet<String>>,
	quitting: AtomicBool,
}

pub fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
	let new_window = MenuItem::with_id(app, "new-editor", "New", true, Some("CmdOrCtrl+N"))?;

	let save = MenuItem::with_id(app, "save", "Save", true, Some("CmdOrCtrl+S"))?;

	let save_as = MenuItem::with_id(app, "save-as", "Save As…", true, Some("CmdOrCtrl+Shift+S"))?;

	// Tauri has documented issues with intercepting native Cmd+Q through its general application-exit event. Replacing the native Quit item gives your app a predictable menu event to handle. See the Tauri issue on macOS application termination. https://github.com/tauri-apps/tauri/issues/9198
	let quit = MenuItem::with_id(app, "quit", "Quit Write", true, Some("CmdOrCtrl+Q"))?;

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
					submenu.prepend(&save_as)?;
					submenu.prepend(&save)?;
					submenu.prepend(&new_window)?;
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
		WindowEvent::Focused(false) => {
			state.focused_windows.lock().unwrap().remove(label);
		}
		WindowEvent::Destroyed => {
			state.focused_windows.lock().unwrap().remove(label);

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
	match event.id().as_ref() {
		"new-editor" => {
			let _ = crate::editor_window::create_editor_window(app);
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
		_ => {}
	}
}
