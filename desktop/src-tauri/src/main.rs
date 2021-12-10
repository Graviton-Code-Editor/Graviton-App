#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod methods;

use gveditor_core::{
    gen_client::Client,
    tokio::{
        self,
        sync::{
            mpsc::{
                channel,
                Receiver,
                Sender,
            },
            Mutex as AsyncMutex,
        },
    },
    transports::{
        LocalHandler,
        Messages,
        Transport,
    },
    Configuration,
    Core,
    State,
    StatesList,
    TokenFlags,
};
use gveditor_core_api::Extension;
use std::{
    sync::{
        Arc,
        Mutex,
    },
    thread,
};
use tauri::{
    api::path::{
        resolve_path,
        BaseDirectory,
    },
    utils::assets::EmbeddedAssets,
    Context,
    Manager,
    Window,
};

/// The window state
pub struct TauriState {
    client: Client,
    channel_receiver: Arc<AsyncMutex<Receiver<Messages>>>,
    channel_sender: Sender<Messages>,
}

/// Forward all the core events to the webview
#[tauri::command]
fn init_listener(window: Window, state: tauri::State<TauriState>) {
    let channel_receiver = state.channel_receiver.clone();

    // And every event from the core sent it to the webview
    thread::spawn(move || {
        let runtime = tokio::runtime::Runtime::new().unwrap();

        runtime.block_on(async move {
            let mut channel_receiver = channel_receiver.lock().await;

            loop {
                if let Some(msg) = channel_receiver.recv().await {
                    window.emit("to_webview", msg).unwrap();
                }
            }
        });
    });
}

/// Launch the main window
///
/// # Arguments
///
/// * `token`   - The authentication token that will be used to access the local state
/// * `context` - The Tauri context
///
fn open_tauri(
    context: Context<EmbeddedAssets>,
    client: Client,
    channel_sender: Sender<Messages>,
    channel_receiver: Receiver<Messages>,
) {
    let channel_receiver = Arc::new(AsyncMutex::new(channel_receiver));

    tauri::Builder::default()
        .on_page_load(|window, _| {
            let state: tauri::State<TauriState> = window.state();
            let channel_sender = state.channel_sender.clone();

            window.listen("to_core", move |event| {
                let channel_sender = channel_sender.clone();
                let msg: Messages = serde_json::from_str(event.payload().unwrap()).unwrap();
                tokio::task::spawn(async move { channel_sender.send(msg).await });
            });
        })
        .manage(TauriState {
            client,
            channel_receiver,
            channel_sender,
        })
        .invoke_handler(tauri::generate_handler![
            methods::get_state_by_id,
            methods::list_dir_by_path,
            methods::read_file_by_path,
            methods::set_state_by_id,
            init_listener
        ])
        .run(context)
        .expect("failed to run tauri application");
}

/// Returns a vector of pointers to all extensions instances
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
        // Retrieve the entry function handler
        let func: libloading::Symbol<unsafe extern "C" fn() -> Box<dyn Extension + Send>> =
            lib.get(b"entry").unwrap();
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

static TOKEN: &str = "graviton_token";

#[tokio::main]
async fn main() {
    let context = tauri::generate_context!("tauri.conf.json");

    // Load built-in extensions
    let built_in_extensions_path = get_built_in_extensions_path(&context);
    let built_in_extensions = load_extensions_from_path(built_in_extensions_path);

    // Create the StatesList
    let states = {
        let default_state = State::new(1, built_in_extensions);
        let states = StatesList::new()
            .with_tokens(&[TokenFlags::All(TOKEN.to_string())])
            .with_state(default_state);

        Arc::new(Mutex::new(states))
    };

    // Core sender and receiver
    let (core_sender, core_receiver) = channel(1);

    // Local handler
    let (local_handler, client, webview_sender) = LocalHandler::new(states.clone(), core_sender);
    let local_handler: Box<dyn Transport + Send + Sync> = Box::new(local_handler);

    // Create the configuration
    let config = Configuration::new(local_handler);

    // Create the Core
    let core = Core::new(config, states);

    // Run the core in a separate thread
    tokio::task::spawn(async move { core.run().await });

    // Open the window
    open_tauri(context, client, webview_sender, core_receiver);
}
