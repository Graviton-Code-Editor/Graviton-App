use home::home_dir;
use std::fs;
use tauri::WindowBuilder;

fn open_tauri(local_token: String) {
    tauri::Builder::default()
        .create_window(
            "Rust".to_string(),
            // This should better load a static file in production, using a server is fine for development
            tauri::WindowUrl::App(format!("http://localhost:3000?token={}", local_token).into()),
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

fn main() {
    if let Some(home) = home_dir() {
        let local_token =
            fs::read_to_string(format!("{}/graviton_local_token", home.to_str().unwrap())).unwrap();
        open_tauri(local_token);
    }
}
