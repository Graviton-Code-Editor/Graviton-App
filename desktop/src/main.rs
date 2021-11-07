use tauri::WindowBuilder;

fn main() {
    tauri::Builder::default()
        .create_window(
            "Rust".to_string(),
            // This should better load a static file in production, using a server is fine for development
            tauri::WindowUrl::App("http://localhost:3000".into()),
            |window_builder, webview_attributes| {
                (
                    window_builder.title("Graviton Editor Test"),
                    webview_attributes,
                )
            },
        )
        .run(tauri::generate_context!("src/conf.json"))
        .expect("failed to run tauri application");
}
