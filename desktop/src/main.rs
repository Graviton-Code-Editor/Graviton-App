use home::home_dir;
use std::{
    fs,
    sync::{
        Arc,
        Mutex,
    },
};
use tauri::WindowBuilder;

use graviton_core::{
    tokio,
    Configuration,
    Core,
    State,
    StatesList,
    TokenFlags,
};

fn open_tauri(local_token: String) {
    tauri::Builder::default()
        .create_window(
            "Rust".to_string(),
            // This should better load a static file in production, using a server is fine for development
            tauri::WindowUrl::App(format!("http://localhost:8080?token={}", local_token).into()),
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

#[tokio::main]
async fn main() {
    let token = "demo_secret_token";

    // Create the configuration
    let config = Arc::new(Mutex::new(Configuration::new()));

    // Create an empty states list
    let mut states = StatesList::new();
    let states = states.with_tokens(&vec![TokenFlags::All(token.to_string())]);
    let mut demo_state = State::new(1);
    states.add_state(&mut demo_state);

    if let Some(home) = home_dir() {
        fs::write(
            format!("{}/graviton_local_token", home.to_str().unwrap()),
            token.as_bytes(),
        )
        .unwrap();
    }

    // Create a new config passing the configuration
    let core = Core::new(config, states.to_owned());

    tokio::task::spawn(async move { core.run().await });

    open_tauri(token.to_string());
}
