#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod methods;
use gveditor_core::{
    gen_client::Client,
    handlers::{
        LocalHandler,
        TransportHandler,
    },
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
    Configuration,
    Core,
};
use gveditor_core_api::{
    extensions_manager::ExtensionsManager,
    messaging::Messages,
    state::{
        StatesList,
        TokenFlags,
    },
    State,
};
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

/// The app backend state
pub struct TauriState {
    client: Client,
    receiver_from_handler: Arc<AsyncMutex<Receiver<Messages>>>,
    sender_to_handler: Sender<Messages>,
}

/// Forward all the core events to the webview
#[tauri::command]
fn init_listener(window: Window, state: tauri::State<TauriState>) {
    let receiver_from_handler = state.receiver_from_handler.clone();

    // And every event from the core sent it to the webview
    thread::spawn(move || {
        let runtime = tokio::runtime::Runtime::new().unwrap();

        runtime.block_on(async move {
            let mut receiver_from_handler = receiver_from_handler.lock().await;

            loop {
                if let Some(msg) = receiver_from_handler.recv().await {
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
/// * `context`                 - The Tauri context
/// * `client`                  - The JSON RPC Local client
/// * `sender_to_handler`       - A sender to the local handler
/// * `receiver_from_handler`   - A receiver from the local handler
///
fn open_tauri(
    context: Context<EmbeddedAssets>,
    client: Client,
    sender_to_handler: Sender<Messages>,
    receiver_from_handler: Receiver<Messages>,
) {
    let receiver_from_handler = Arc::new(AsyncMutex::new(receiver_from_handler));

    tauri::Builder::default()
        .on_page_load(|window, _| {
            let state: tauri::State<TauriState> = window.state();
            let sender_to_handler = state.sender_to_handler.clone();

            window.listen("to_core", move |event| {
                let sender_to_handler = sender_to_handler.clone();
                let msg: Messages = serde_json::from_str(event.payload().unwrap()).unwrap();
                tokio::task::spawn(async move { sender_to_handler.send(msg).await });
            });
        })
        .manage(TauriState {
            client,
            receiver_from_handler,
            sender_to_handler,
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
/// * `path`    - The directory path from where to load the extensions
/// * `sender`  -  A mpsc sender to communicate with the core
///
async fn load_extensions_from_path(path: String, sender: Sender<Messages>) -> ExtensionsManager {
    let mut manager = ExtensionsManager::new();
    // NOTE: This should load all the built-in extensions, not just the git one. WIP
    unsafe {
        // Load the extension library
        let lib = Box::leak(Box::new(
            libloading::Library::new(format!("{}/{}", path, "git.dll")).unwrap(),
        ));
        // Retrieve the entry function handler
        let entry_func: libloading::Symbol<
            unsafe extern "C" fn(&ExtensionsManager, Sender<Messages>) -> (),
        > = lib.get(b"entry").unwrap();

        entry_func(&mut manager, sender);
    }
    manager
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

// Dummy token
static TOKEN: &str = "graviton_token";

#[tokio::main]
async fn main() {
    let (to_core, from_core) = channel::<Messages>(1);
    let from_core = Arc::new(AsyncMutex::new(from_core));

    let context = tauri::generate_context!("tauri.conf.json");

    // Load built-in extensions
    let built_in_extensions_path = get_built_in_extensions_path(&context);
    let extensions_manager =
        load_extensions_from_path(built_in_extensions_path, to_core.clone()).await;

    // Create the StatesList
    let states = {
        let default_state = State::new(1, extensions_manager);
        let states = StatesList::new()
            .with_tokens(&[TokenFlags::All(TOKEN.to_string())])
            .with_state(default_state);

        Arc::new(Mutex::new(states))
    };

    // Core sender and receiver
    let (to_webview, from_webview) = channel(1);

    // Local handler
    let (local_handler, client, to_local) = LocalHandler::new(states.clone(), to_webview);
    let local_handler: Box<dyn TransportHandler + Send + Sync> = Box::new(local_handler);

    // Create the configuration
    let config = Configuration::new(local_handler, to_core, from_core);

    // Create the Core
    let core = Core::new(config, states);

    // Run the core in a separate thread
    tokio::task::spawn(async move { core.run().await });

    // Open the window
    open_tauri(context, client, to_local, from_webview);
}
