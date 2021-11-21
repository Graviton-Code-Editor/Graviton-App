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

struct TauriState {
    token: String
}

#[tauri::command]
fn get_token(state: tauri::State<TauriState>) -> String {
    return state.token.clone();
}

fn open_tauri(token: String) {

    tauri::Builder::default()
        .manage(TauriState { token })
        .invoke_handler(tauri::generate_handler![get_token])
        .create_window(
            "Rust".to_string(),
            // This should better load a static file in production, using a server is fine for development
            tauri::WindowUrl::App("http://localhost:8080".into()),
            |window_builder, webview_attributes| {
                (
                    window_builder.title("Graviton Editor"),
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
