use serde::Deserialize;
use std::fs;
use tauri::{AppHandle,Manager};

#[derive(Deserialize, Default)]
#[serde(default)]
struct AppConfig {
	window: WindowConfig,
	editor: EditorConfig,
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

#[derive(Deserialize)]
#[serde(default)]
struct EditorConfig {
	assets_suffix: String,
}

impl Default for EditorConfig {
	fn default() -> Self {
		Self {
			assets_suffix: ".assets".to_string(),
		}
	}
}

fn load_config(app: &AppHandle) -> AppConfig {
	let Ok(data_dir) = app.path().app_data_dir() else {
		return AppConfig::default();
	};

	let config_path = data_dir.join("config.toml");

	let Ok(contents) = fs::read_to_string(&config_path) else {
		return AppConfig::default();
	};

	match toml::from_str(&contents) {
		Ok(config) => config,
		Err(err) => {
			eprintln!("Failed to parse {}: {err}", config_path.display());
			AppConfig::default()
		}
	}
}

pub fn get_window_size(app: &AppHandle) -> (f64, f64) {
	let config = load_config(app);
	let width = config.window.width;
	let height = config.window.height;

	if !width.is_finite() || !height.is_finite() || width < 200.0 || height < 200.0 {
		eprintln!("Invalid window size in ~/.wright.conf");
		return (DEFAULT_WIDTH, DEFAULT_HEIGHT);
	}

	(width, height)
}

// Allow nested directories such as .assets/lfs
#[tauri::command]
pub fn get_assets_suffix(app: AppHandle) -> String {
	let suffix = load_config(&app).editor.assets_suffix;

	if suffix.starts_with('.')
		&& suffix.len() > 1
		&& !suffix.contains('\\')
		&& !suffix
			.split('/')
			.any(|part| part == ".." || part.is_empty())
	{
		suffix
	} else {
		".assets".to_string()
	}
}
