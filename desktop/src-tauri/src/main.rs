#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use gveditor_core::{
    jsonrpc_http_server::DomainsValidation,
    tokio,
    Configuration,
    Core,
    State,
    StatesList,
    TokenFlags,
};
use gveditor_core_api::Extension;
use home::home_dir;
use std::{
    fs,
    sync::{
        Arc,
        Mutex,
    },
};
use tauri::{
    api::path::{
        resolve_path,
        BaseDirectory,
    },
    utils::assets::EmbeddedAssets,
    Context,
};

struct TauriState {
    token: String,
}

#[tauri::command]
fn get_token(state: tauri::State<TauriState>) -> String {
    state.token.clone()
}

/// Launch the main window
///
/// # Arguments
///
/// * `token`   - The authentication token that will be used to access the local state
/// * `context` - The Tauri context
///
fn open_tauri(token: String, context: Context<EmbeddedAssets>) {
    tauri::Builder::default()
        .manage(TauriState { token })
        .invoke_handler(tauri::generate_handler![get_token])
        .run(context)
        .expect("failed to run tauri application");
}

/// Returns a vector of pointer to all extensions instances
///
/// # Arguments
///
/// * `path` - The directory path from where to load the extensions
///
fn load_extensions_from_path(path: String) -> Vec<Arc<Mutex<Box<dyn Extension + Send>>>> {
    let mut extensions = Vec::new();
    // NOTE: This should load all the built-in extensions, not just the git one. WIP
    unsafe {
        // Load the extension library
        let lib = libloading::Library::new(format!("{}/{}", path, "git.dll")).unwrap();
        // Retrieve the main function handler
        let func: libloading::Symbol<unsafe extern "C" fn() -> Box<dyn Extension + Send>> =
            lib.get(b"main").unwrap();
        // Initialize the extension
        let extension_obj = func();
        let extension_obj = Arc::new(Mutex::new(extension_obj));
        extensions.push(extension_obj);
    }
    extensions
}

/// Returns the bundled path to the extensions directory
///
/// # Arguments
///
/// * `context` - The Tauri Context
///
fn get_built_in_extensions_path(context: &Context<EmbeddedAssets>) -> String {
    resolve_path(
        context.config(),
        context.package_info(),
        ".",
        Some(BaseDirectory::Resource),
    )
    .unwrap()
    .to_string_lossy()
    .to_string()
}

#[tokio::main]
async fn main() {
    let context = tauri::generate_context!("tauri.conf.json");
    let token = "demo_secret_token";

    // Load built-in extensions
    let built_in_extensions_path = get_built_in_extensions_path(&context);
    let built_in_extensions = load_extensions_from_path(built_in_extensions_path);

    // Create the configuration
    let config = Arc::new(Mutex::new(Configuration::new(DomainsValidation::Disabled)));

    // Create the StatesList
    let states = {
        let mut demo_state = State::new(1, built_in_extensions);
        StatesList::new()
            .with_tokens(&[TokenFlags::All(token.to_string())])
            .with_state(&mut demo_state)
    };
    let states = Arc::new(Mutex::new(states));

    if let Some(home) = home_dir() {
        fs::write(
            format!("{}/graviton_local_token", home.to_str().unwrap()),
            token.as_bytes(),
        )
        .unwrap();
    }

    // Create a new config passing the configuration
    let core = Core::new(config, states);

    tokio::task::spawn(async move { core.run().await });

    open_tauri(token.to_string(), context);
}
