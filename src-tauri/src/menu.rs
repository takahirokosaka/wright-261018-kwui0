use tauri::{AppHandle, menu::MenuItem};

pub fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
	let new_window = MenuItem::with_id(app, "new-editor", "New Window", true, Some("CmdOrCtrl+N"))?;

	if let Some(menu) = app.menu() {
		if let Some(file_menu) = menu
			.items()?
			.iter()
			.filter_map(|item| item.as_submenu())
			.find(|submenu| submenu.text().unwrap_or_default() == "File")
		{
			file_menu.prepend(&new_window)?;
		}
	}

	Ok(())
}

pub fn handle_event(app: &AppHandle, event: tauri::menu::MenuEvent) {
	if event.id() == "new-editor" {
		let _ = crate::windows::create_editor_window(app);
	}
}
