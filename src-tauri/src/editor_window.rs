use tauri::{AppHandle, WebviewUrl, WebviewWindowBuilder};

pub fn create_editor_window(app: &AppHandle) -> tauri::Result<()> {
	// "doc-" prefix makes window labels easier to identify when debugging, especially if you later add windows such as "settings" or "about".
	let label = format!("doc-{}", uuid::Uuid::new_v4());

	WebviewWindowBuilder::new(app, &label, WebviewUrl::App("index.html".into()))
		.title("Untitled.md")
		.inner_size(1000.0, 750.0)
		.build()?;

	Ok(())
}
