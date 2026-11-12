use std::fs;
use tauri::{
	AppHandle, Manager,
	http::{Response, StatusCode, Uri},
};

pub fn serve(app: &AppHandle, uri: &Uri) -> Response<Vec<u8>> {
	let not_found = || {
		Response::builder()
			.status(StatusCode::NOT_FOUND)
			.body(Vec::new())
			.unwrap()
	};

	// For now only fonts are served.
	if uri.host() != Some("font") {
		return not_found();
	}

	let Some(filename) = uri.path().strip_prefix('/') else {
		return not_found();
	};

	if filename.is_empty() || filename.contains('/') || filename.contains('\\') {
		return not_found();
	}

	let Ok(data_dir) = app.path().app_data_dir() else {
		return not_found();
	};

	let Ok(contents) = fs::read(data_dir.join("fonts").join(filename)) else {
		return not_found();
	};

	let content_type = match filename.rsplit('.').next() {
		Some("ttf") => "font/ttf",
		Some("otf") => "font/otf",
		Some("woff2") => "font/woff2",
		_ => return not_found(),
	};

	Response::builder()
		.status(StatusCode::OK)
		.header("Content-Type", content_type)
		.body(contents)
		.unwrap()
}
