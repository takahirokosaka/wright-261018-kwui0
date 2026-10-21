use std::{fs, path::Path};

use serde::Deserialize;
use tauri::{AppHandle, WebviewUrl, WebviewWindowBuilder};

#[derive(Deserialize, Default)]
#[serde(default)]
struct AppConfig {
	window: WindowConfig,
}

#[derive(Deserialize)]
#[serde(default)]
struct WindowConfig {
	width: f64,
	height: f64,
}

const DEFAULT_WIDTH: f64 = 620.0;
const DEFAULT_HEIGHT: f64 = 1000.0;

impl Default for WindowConfig {
	fn default() -> Self {
		Self {
			width: DEFAULT_WIDTH,
			height: DEFAULT_HEIGHT,
		}
	}
}

// cat ~/.write.conf
// [window]
// width = 800
// height = 1200
fn load_window_size() -> (f64, f64) {
	let Some(home) = dirs::home_dir() else {
		return (DEFAULT_WIDTH, DEFAULT_HEIGHT);
	};

	let config_path = home.join(".write.conf");

	let Ok(contents) = fs::read_to_string(&config_path) else {
		return (DEFAULT_WIDTH, DEFAULT_HEIGHT);
	};

	let config: AppConfig = match toml::from_str(&contents) {
		Ok(config) => config,
		Err(err) => {
			eprintln!("Failed to parse {}: {err}", config_path.display());
			return (DEFAULT_WIDTH, DEFAULT_HEIGHT);
		}
	};

	let width = config.window.width;
	let height = config.window.height;

	if !width.is_finite() || !height.is_finite() || width < 200.0 || height < 200.0 {
		eprintln!("Invalid window size in {}", config_path.display());
		return (DEFAULT_WIDTH, DEFAULT_HEIGHT);
	}

	(width, height)
}

pub fn create_editor_window_without_file(app: &AppHandle) -> tauri::Result<()> {
	create_editor_window(app, None)
}

pub fn create_editor_window(app: &AppHandle, path: Option<&str>) -> tauri::Result<()> {
	let label = format!("doc-{}", uuid::Uuid::new_v4());

	let title = path
		.and_then(|p| Path::new(p).file_name())
		.and_then(|name| name.to_str())
		.unwrap_or("Untitled.md");

	let (width, height) = load_window_size();

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
