use std::path::PathBuf;
use tauri::Manager;

mod editor_window;
mod menu;

// Load ~/.write.css as a user-customizable stylesheet at startup.
#[tauri::command]
fn load_user_css() -> Option<String> {
	let path: PathBuf = std::env::var_os("HOME")?.into();
	std::fs::read_to_string(std::path::PathBuf::from(path).join(".write.css")).ok()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	let app = tauri::Builder::default()
		.plugin(tauri_plugin_dialog::init())
		.plugin(tauri_plugin_opener::init())
		.plugin(tauri_plugin_fs::init())
		.plugin(tauri_plugin_clipboard_x::init())
		.setup(app_setup)
		.on_menu_event(menu::handle_event)
		.on_window_event(|window, event| {
			menu::handle_window_event(&window.app_handle(), window.label(), event);
		})
		.invoke_handler(tauri::generate_handler![load_user_css,editor_window::open_markdown_in_new_window])
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

fn app_setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
	// Create the first editor window.
	editor_window::create_editor_window_without_file(app.handle())?;

	// Set up the application menus.
	menu::setup(app)?;

	Ok(())
}
