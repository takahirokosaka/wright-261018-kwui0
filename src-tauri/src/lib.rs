mod menu;
mod windows;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
	format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	let app = tauri::Builder::default()
		.plugin(tauri_plugin_opener::init())
		.setup(app_setup)
		.on_menu_event(menu::handle_event)
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

fn app_setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
	// Create the first editor window.
	windows::create_editor_window(app.handle())?;

	// Set up the application menus.
	menu::setup(app)?;

	Ok(())
}
