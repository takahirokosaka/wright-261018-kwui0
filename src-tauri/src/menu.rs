use tauri::{AppHandle, Emitter, Manager, menu::MenuItem};

pub fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
	let new_window = MenuItem::with_id(app, "new-editor", "New Window", true, Some("CmdOrCtrl+N"))?;

	let save_as = MenuItem::with_id(app, "save-as", "Save As…", true, Some("CmdOrCtrl+S"))?;

	if let Some(menu) = app.menu() {
		if let Some(file_menu) = menu
			.items()?
			.iter()
			.filter_map(|item| item.as_submenu())
			.find(|submenu| submenu.text().unwrap_or_default() == "File")
		{
			file_menu.prepend(&new_window)?;
			file_menu.append(&save_as)?;
		}
	}

	Ok(())
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
		_ => {}
	}
}
