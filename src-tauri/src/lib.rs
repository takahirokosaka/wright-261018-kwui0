use tauri::{AppHandle, WebviewUrl, WebviewWindowBuilder, menu::MenuItem};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
	format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	let app = tauri::Builder::default()
		.plugin(tauri_plugin_opener::init())
		.setup(|app| {
			// Create the first window.
			create_editor_window(app.handle())?;

			let new_window =
				MenuItem::with_id(app, "new-editor", "New Window", true, Some("CmdOrCtrl+N"))?;

			if let Some(menu) = app.menu() {
				// Find the File submenu, then insert New Window at its beginning.
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
		})
		.on_menu_event(|app, event| {
			if event.id() == "new-editor" {
				let _ = create_editor_window(app);
			}
		})
		.invoke_handler(tauri::generate_handler![greet])
		.build(tauri::generate_context!())
		.expect("error while running tauri application");

	app.run(|_app_handle, event| {
		#[cfg(target_os = "macos")]
		if let tauri::RunEvent::ExitRequested {
			api, code: None, ..
		} = event
		{
			api.prevent_exit();
		}
	});
}

fn create_editor_window(app: &AppHandle) -> tauri::Result<()> {
	// "doc-" prefix makes window labels easier to identify when debugging, especially if you later add windows such as "settings" or "about".
	let label = format!("doc-{}", uuid::Uuid::new_v4());

	WebviewWindowBuilder::new(app, &label, WebviewUrl::App("index.html".into()))
		.title("Untitled.md")
		.inner_size(1000.0, 750.0)
		.build()?;

	Ok(())
}
