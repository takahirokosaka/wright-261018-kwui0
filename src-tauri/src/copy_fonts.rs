use std::{fs, path::Path};
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn copy_fonts(app: AppHandle, path: String, fonts: Vec<String>) -> Result<(), String> {
	let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

	let html_path = Path::new(&path);

	let assets_dir = html_path.with_extension("assets").join("fonts");

	fs::create_dir_all(&assets_dir).map_err(|e| e.to_string())?;

	for filename in fonts {
		// Only allow filenames, not arbitrary paths.
		let name = Path::new(&filename);

		if name.components().count() != 1
			|| name.file_name().and_then(|n| n.to_str()) != Some(&filename)
		{
			return Err(format!("Invalid font filename: {filename}"));
		}

		let source = data_dir.join("fonts").join(name);
		let destination = assets_dir.join(name);

		fs::copy(&source, &destination).map_err(|e| format!("Failed to copy {}: {e}", filename))?;
	}

	Ok(())
}
