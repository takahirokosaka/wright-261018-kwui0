use std::path::Path;
use tauri::{AppHandle, WebviewUrl, WebviewWindowBuilder};

use crate::config::get_window_size;

pub fn create_editor_window_without_file(app: &AppHandle) -> tauri::Result<()> {
	create_editor_window(app, None)
}

pub fn create_editor_window(app: &AppHandle, path: Option<&str>) -> tauri::Result<()> {
	let label = format!("doc-{}", uuid::Uuid::new_v4());

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

	builder.build()?;

	Ok(())
}

#[tauri::command]
pub fn open_markdown_in_new_window(app: AppHandle, path: String) -> Result<(), String> {
	create_editor_window(&app, Some(&path)).map_err(|e| e.to_string())
}
