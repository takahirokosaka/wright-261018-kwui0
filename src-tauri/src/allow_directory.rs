use std::path::Path;
use tauri_plugin_fs::FsExt;

// Receives a document path and authorizes access to its parent directory.
#[tauri::command]
pub fn allow_document_directory(app: tauri::AppHandle, file_path: String) -> Result<(), String> {
	let file = Path::new(&file_path);

	if !file.is_absolute() {
		return Err("Document path must be absolute".into());
	}

	let parent = file.parent().ok_or("Document has no parent directory.")?;

	// Require an existing directory and resolve it to a canonical path.
	let parent = parent.canonicalize().map_err(|e| e.to_string())?;

	if !parent.is_dir() {
		return Err("Document parent is not a directory".into());
	}

	app.fs_scope()
		.allow_directory(parent, true)
		.map_err(|e| e.to_string())?;

	Ok(())
}
