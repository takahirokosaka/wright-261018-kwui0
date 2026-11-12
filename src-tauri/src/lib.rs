use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;
use tauri::plugin::Builder;
use tauri_plugin_opener::OpenerExt;

use crate::editor_window::open_markdown_in_new_window;

mod allow_directory;
mod config;
mod editor_window;
mod menu;

// Load custom.css at startup from the app's data directory.
#[tauri::command]
fn load_user_css(app: AppHandle) -> Option<String> {
	let dir = app.path().app_data_dir().ok()?;
	std::fs::create_dir_all(&dir).ok()?;
	std::fs::read_to_string(dir.join("custom.css")).ok()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	let app = tauri::Builder::default()
		.plugin(tauri_plugin_dialog::init())
		.plugin(tauri_plugin_opener::init())
		.plugin(
			Builder::<tauri::Wry, ()>::new("external-link-guard")
				.on_navigation(|webview, url| {
					let scheme = url.scheme();
					let host = url.host_str().unwrap_or("");

					// Allow the app's own pages.
					if scheme == "tauri" && host == "localhost" {
						return true;
					}

					// Allow the standard Tauri production origin.
					if (scheme == "http" || scheme == "https") && host == "tauri.localhost" {
						return true;
					}

					// Allow the local development server.
					if cfg!(dev) && (host == "localhost" || host == "127.0.0.1" || host == "::1") {
						return true;
					}

					// Send external web links to the system browser.
					if scheme == "http" || scheme == "https" {
						let _ = webview
							.app_handle()
							.opener()
							.open_url(url.as_str(), None::<&str>);
					}

					// Cancel the WebView navigation in all other cases.
					false
				})
				.build(),
		)
		.plugin(tauri_plugin_fs::init())
		.plugin(tauri_plugin_clipboard_x::init())
		.setup(app_setup)
		.on_menu_event(menu::handle_event)
		.on_window_event(|window, event| {
			editor_window::handle_window_event(&window.app_handle(), window.label(), event);
			menu::handle_window_event(&window.app_handle(), window.label(), event);
		})
		.invoke_handler(tauri::generate_handler![
			load_user_css,
			editor_window::open_markdown_in_new_window,
			allow_directory::allow_document_directory,
			config::get_assets_suffix
		])
		.build(tauri::generate_context!())
		.expect("error while running tauri application");

	editor_window::setup_document_tracking(&app);

	// The event loop. On macOS, this can run BEFORE app_setup if the user launched the app by double-clicking an .md file.
	app.run(|app_handle, event| {
		#[cfg(target_os = "macos")]
		match event {
			tauri::RunEvent::Opened { urls } => {
				// use crate::editor_window::OpenDocuments;

				// let registered = app_handle.try_state::<OpenDocuments>().is_some();

				// let _ = std::fs::write(
				// 	"/tmp/wright-state-setup.log",
				// 	format!("event handling: OpenDocuments is registered: {registered}\n"),
				// );

				let files: Vec<PathBuf> = urls
					.into_iter()
					.filter_map(|url| url.to_file_path().ok())
					.filter(is_markdown_file)
					.collect();

				if files.is_empty() {
					// This doesn't work. RunEvent::Opened is an event handler, not a one-time startup flag.
					// editor_window::create_editor_window_without_file(app_handle);
				} else {
					handle_files(app_handle, files);
				}
			}
			tauri::RunEvent::ExitRequested {
				api, code: None, ..
			} => {
				api.prevent_exit();
			}
			_ => {}
		}

		// TODO
		#[cfg(not(target_os = "macos"))]
		let _ = (app_handle, event);
	});
}

fn app_setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
	// let _ = std::fs::write("/tmp/wright-app_setup.log", "app_setup entered\n");

	// This doesn't work because app.run() runs before app_setup when double-clicking an .md file before launching the app on macOS.
	// editor_window::setup_document_tracking(app);

	// Set up the application menus.
	menu::setup(app)?;

	#[cfg(target_os = "macos")]
	{
		let app_handle = app.handle().clone();

		// Workaround
		std::thread::spawn(move || {
			std::thread::sleep(std::time::Duration::from_millis(200));

			let handle_for_task = app_handle.clone();

			if let Err(err) = app_handle.run_on_main_thread(move || {
				// Only create a default window if no window exists.
				if handle_for_task.webview_windows().is_empty() {
					if let Err(err) =
						editor_window::create_editor_window(&handle_for_task, None, false)
					{
						eprintln!("Failed to create editor window: {err}");
					}
				}
			}) {
				eprintln!("Failed to schedule window creation: {err}");
			}
		});
	}

	// Process files passed on the command line at startup.
	#[cfg(any(target_os = "windows", target_os = "linux"))]
	{
		let files: Vec<PathBuf> = std::env::args_os()
			.skip(1)
			.map(PathBuf::from)
			.filter(is_markdown_file)
			.collect();

		if files.is_empty() {
			// Create the first editor window.
			editor_window::create_editor_window_without_file(app.handle())?;
		} else {
			handle_files(app.handle(), files);
		}
	}

	Ok(())
}

fn is_markdown_file(path: &PathBuf) -> bool {
	path.extension().is_some_and(|ext| {
		ext.eq_ignore_ascii_case("md")
			|| ext.eq_ignore_ascii_case("markdown")
			|| ext.eq_ignore_ascii_case("mdx")
	})
}

fn handle_files(app: &AppHandle, files: Vec<PathBuf>) {
	if files.is_empty() {
		return;
	}

	let paths: Vec<String> = files
		.into_iter()
		.map(|p| p.to_string_lossy().into_owned())
		.collect();

	for path in &paths {
		open_markdown_in_new_window(app.clone(), path.clone()).unwrap_or_else(|_e| {
			// let message = format!("Failed opening file: {e:?}\n");
			// let _ = std::fs::write("/tmp/wright-debug.log", message);
		});
	}
}
