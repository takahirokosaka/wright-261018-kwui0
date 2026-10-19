use std::{collections::HashSet, sync::Mutex};
use tauri::{
	AppHandle, Emitter, Manager, WindowEvent,
	menu::{MenuItem, SubmenuBuilder},
};

pub struct MenuState {
	close_window: MenuItem<tauri::Wry>,
	save_as: MenuItem<tauri::Wry>,
	focused_windows: Mutex<HashSet<String>>,
}

pub fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
	let new_window = MenuItem::with_id(app, "new-editor", "New", true, Some("CmdOrCtrl+N"))?;

	let save_as = MenuItem::with_id(app, "save-as", "Save As…", true, Some("CmdOrCtrl+S"))?;

	// TODO: ⌘W doesn't appear in the menu. Why?
	let close_window = MenuItem::with_id(app, "close-editor", "Close", true, Some("CmdOrCtrl+W"))?;

	let file_menu = SubmenuBuilder::new(app, "File")
		.item(&new_window)
		.item(&save_as)
		.item(&close_window)
		.build()?;

	// Replace the original File menu with the above.
	if let Some(menu) = app.menu() {
		let items = menu.items()?;

		for (index, item) in items.iter().enumerate() {
			if let Some(submenu) = item.as_submenu() {
				if submenu.text()? == "File" {
					menu.remove_at(index)?;
					menu.insert(&file_menu, index)?;
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
		close_window,
		save_as,
		focused_windows: Mutex::new(focused_windows),
	});

	update_enabled_state(app.app_handle());

	Ok(())
}

fn update_enabled_state(app: &AppHandle) {
	let state = app.state::<MenuState>();
	let enabled = !state.focused_windows.lock().unwrap().is_empty();

	let _ = state.save_as.set_enabled(enabled);
	let _ = state.close_window.set_enabled(enabled);
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
		"save-as" => {
			let focused = app
				.webview_windows()
				.into_values()
				.find(|window| window.is_focused().unwrap_or(false));

			if let Some(window) = focused {
				let _ = window.emit_to(window.label(), "menu-save-as", ());
			}
		}
		"close-editor" => {
			if let Some(window) = app
				.webview_windows()
				.into_values()
				.find(|window| window.is_focused().unwrap_or(false))
			{
				let _ = window.close();
			}
		}
		_ => {}
	}
}
