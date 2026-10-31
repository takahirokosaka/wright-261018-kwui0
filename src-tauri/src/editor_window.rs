use std::{
	collections::HashMap,
	path::{Path, PathBuf},
	sync::Mutex,
};

use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder, WindowEvent};

use crate::config::get_window_size;

#[derive(Default)]
pub struct OpenDocuments(Mutex<HashMap<PathBuf, String>>);

// Initialize the tracking state
pub fn setup_document_tracking(app: &tauri::App) {
	app.manage(OpenDocuments::default());
}

pub fn handle_window_event(app: &AppHandle, label: &str, event: &WindowEvent) {
	if let WindowEvent::Destroyed = event {
		// remove the entry from OpenDocuments
		let state = app.state::<OpenDocuments>();
		let mut documents = state.0.lock().unwrap();
		documents.retain(|_, window_label| window_label != label);
	}
}

pub fn create_editor_window(
	app: &AppHandle,
	path: Option<&str>,
	open_filechooser_immediately: bool,
) -> tauri::Result<WebviewWindow> {
	let prefix = if open_filechooser_immediately {
		"openfc-"
	} else {
		"doc-"
	};
	let label = format!("{}{}", prefix, uuid::Uuid::new_v4());

	let title = path
		.and_then(|p| Path::new(p).file_name())
		.and_then(|name| name.to_str())
		.unwrap_or("Untitled.md");

	let (width, height) = get_window_size();

	let builder = WebviewWindowBuilder::new(app, &label, WebviewUrl::App("index.html".into()))
		.title(title)
		.inner_size(width, height);

	let builder = if let Some(path) = path {
		let script = format!(
			"window.__INITIAL_FILE_PATH__ = {};",
			serde_json::to_string(path).expect("serialize file path"),
		);
		builder.initialization_script(&script)
	} else {
		builder
	};

	// register the path
	if !open_filechooser_immediately {
		if let Some(path) = path {
			if let Ok(canonical_path) = Path::new(path).canonicalize() {
				let state = app.state::<OpenDocuments>();
				state.0.lock().unwrap().insert(canonical_path, label);
			}
		}
	}

	let window = builder.build()?;

	Ok(window)
}

#[tauri::command]
pub fn open_markdown_in_new_window(app: AppHandle, path: String) -> Result<(), String> {
	let path = if path == "demo" {

		// copy the bundled file into the app's data directory, then open that copy.

		let source = app
			.path()
			.resolve("sample.md", tauri::path::BaseDirectory::Resource)
			.map_err(|e| e.to_string())?;

		let demo_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

		std::fs::create_dir_all(&demo_dir).map_err(|e| e.to_string())?;

		let demo_copy = demo_dir.join("demo.md");

		std::fs::copy(&source, &demo_copy).map_err(|e| e.to_string())?;

		demo_copy.to_string_lossy().into_owned()
	} else {
		path
	};

	let canonical_path = Path::new(&path).canonicalize().map_err(|e| e.to_string())?;

	// This kills the app silently if app.run() runs before setup_document_tracking() runs. We have moved calling setup_document_tracking() before app.run() and the problem is solved.
	let state = app.state::<OpenDocuments>();

	let guard = match state.0.lock() {
		Ok(guard) => guard,
		Err(e) => {
			let _ = std::fs::write(
				"/tmp/wright-lock-debug.log",
				format!("LOCK ERROR: {:?}\n", e),
			);
			return Err(e.to_string());
		}
	};

	let existing_label = guard.get(&canonical_path).cloned();

	drop(guard);

	// If the file is already open, focus its associated window.
	if let Some(label) = existing_label {
		if let Some(window) = app.get_webview_window(&label) {
			window.set_focus().map_err(|e| e.to_string())?;
			return Ok(());
		}
	}

	// otherwise, make a new window
	create_editor_window(&app, Some(&path), false)
		.map(|_| ())
		.map_err(|e| e.to_string())
}
