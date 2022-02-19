#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod methods;
use gveditor_core::gen_client::Client;
use gveditor_core::handlers::{
    LocalHandler,
    TransportHandler,
};
use gveditor_core::tokio::sync::mpsc::{
    channel,
    Receiver,
    Sender,
};
use gveditor_core::tokio::sync::Mutex as AsyncMutex;
use gveditor_core::{
    tokio,
    Configuration,
    Core,
};
use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::messaging::Messages;
use gveditor_core_api::state::{
    StatesList,
    TokenFlags,
};
use gveditor_core_api::state_persistors::file::FilePersistor;
use gveditor_core_api::State;
use std::fs;
use std::fs::File;
use std::path::PathBuf;
use std::sync::{
    Arc,
    Mutex,
};
use tauri::api::path::{
    resolve_path,
    BaseDirectory,
};
use tauri::utils::assets::EmbeddedAssets;
use tauri::{
    Context,
    Manager,
};
use tracing_subscriber::prelude::__tracing_subscriber_SubscriberExt;
use tracing_subscriber::{
    fmt,
    EnvFilter,
    Registry,
};

/// The app backend state
pub struct TauriState {
    client: Client,
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
    let sender_to_handler = Arc::new(AsyncMutex::new(sender_to_handler));

    tauri::Builder::default()
        .setup(move |app| {
            let receiver_from_handler = receiver_from_handler.clone();
            let sender_to_handler = sender_to_handler.clone();

            let window = app.get_window("main").unwrap();

            // Forward messages from the webview to the core
            window.listen("to_core", move |event| {
                let sender_to_handler = sender_to_handler.clone();
                let msg: Messages = serde_json::from_str(event.payload().unwrap()).unwrap();
                tokio::task::spawn(async move {
                    let sender_to_handler = sender_to_handler.lock().await;
                    sender_to_handler.send(msg).await
                });
            });

            // Forward messages from the core to the webview
            tokio::spawn(async move {
                let mut receiver_from_handler = receiver_from_handler.lock().await;

                loop {
                    if let Some(msg) = receiver_from_handler.recv().await {
                        window.emit("to_webview", msg).unwrap();
                    }
                }
            });

            Ok(())
        })
        .manage(TauriState { client })
        .invoke_handler(tauri::generate_handler![
            methods::get_state_by_id,
            methods::list_dir_by_path,
            methods::write_file_by_path,
            methods::read_file_by_path,
            methods::set_state_by_id,
            methods::get_ext_info_by_id,
            methods::get_ext_list_by_id
        ])
        .run(context)
        .expect("failed to run tauri application");
}

/// Returns the location of the settings file
///
/// # Arguments
///
/// * `context` - The Tauri Context
///
fn get_settings_path(context: &Context<EmbeddedAssets>) -> PathBuf {
    let states_path = resolve_path(
        context.config(),
        context.package_info(),
        ".graviton/states",
        Some(BaseDirectory::Home),
    )
    .unwrap();

    fs::create_dir_all(&states_path).ok();

    let settings_file_path = states_path.join("settings.json");

    File::create(&settings_file_path).unwrap();

    settings_file_path
}

/// Returns the path where third-party extensions are installed and loaded from
///
/// # Arguments
///
/// * `context` - The Tauri Context
///
fn get_extensions_installation_path(context: &Context<EmbeddedAssets>) -> PathBuf {
    let extensions_installation_path = resolve_path(
        context.config(),
        context.package_info(),
        ".graviton/extensions",
        Some(BaseDirectory::Home),
    )
    .unwrap();

    fs::create_dir_all(&extensions_installation_path).ok();

    extensions_installation_path
}

/// Setup the logger
fn setup_logger() {
    let filter = EnvFilter::default()
        .add_directive("graviton=info".parse().unwrap())
        .add_directive("gveditor_core_api=info".parse().unwrap())
        .add_directive("gveditor_core=info".parse().unwrap());

    let subscriber = Registry::default().with(filter).with(fmt::Layer::default());

    tracing::subscriber::set_global_default(subscriber).expect("Unable to set global subscriber");
}

// Dummy token
static TOKEN: &str = "graviton_token";
static STATE_ID: u8 = 1;

#[tokio::main]
async fn main() {
    setup_logger();

    let (to_core, from_core) = channel::<Messages>(1);
    let from_core = Arc::new(AsyncMutex::new(from_core));

    let context = tauri::generate_context!("tauri.conf.json");

    // Get the paths
    let settings_file_path = get_settings_path(&context);
    let _third_party_extensions_path = get_extensions_installation_path(&context);

    let mut extensions_manager = ExtensionsManager::new(to_core.clone());

    // Load built-in extensions
    extensions_manager
        .load_extension_from_entry(
            git_for_graviton::entry,
            git_for_graviton::get_info(),
            STATE_ID,
        )
        .await;

    // Create the StatesList
    let states = {
        let default_state = State::new(
            STATE_ID,
            extensions_manager,
            Box::new(FilePersistor::new(settings_file_path)),
        );
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
