use gveditor_core_api::extensions::base::{Extension, ExtensionInfo};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::extensions::modules::command::Command;
use gveditor_core_api::extensions::modules::statusbar_item::StatusBarItem;
use gveditor_core_api::messaging::ClientMessages;
use gveditor_core_api::{tokio, ManifestExtension, ManifestInfo, Mutex, State};
use lsp::JSTSLanguageServerBuilder;
use std::sync::Arc;
use tracing::info;

mod lsp;

pub static EXTENSION_NAME: &str = "TypeScript/JavaScript Intellisense";

struct TSLSPExtension {
    client: ExtensionClient,
    state_id: u8,
}

impl Extension for TSLSPExtension {
    fn get_info(&self) -> ExtensionInfo {
        ExtensionInfo {
            id: env!("CARGO_PKG_NAME").to_string(),
            name: EXTENSION_NAME.to_string(),
        }
    }

    fn init(&mut self, state: Arc<Mutex<State>>) {
        let client = self.client.clone();
        let state_id = self.state_id;

        tokio::spawn(async move {
            let status_bar_item = StatusBarItem::new(client.clone(), state_id, "");

            async fn enable_ls(
                state: &Arc<Mutex<State>>,
                client: ExtensionClient,
                state_id: u8,
                status_bar_item: StatusBarItem,
            ) {
                let mut state = state.lock().await;

                state.language_server_builders.insert(
                    "typescript".to_string(),
                    Arc::new(Mutex::new(Box::new(JSTSLanguageServerBuilder {
                        client,
                        state_id,
                        status_bar_item,
                    }))),
                );
                info!("Enabled JS/TS Language Server");
            }

            async fn disable_ls(state: &Arc<Mutex<State>>) {
                let mut state = state.lock().await;
                state.unload_language_server("typescript").await;
                info!("Disabled JS/TS Language Server");
            }

            async {
                let state = state.clone();
                let mut disable_command = Command::new(
                    client.clone(),
                    state_id,
                    "js_ls.disable",
                    "Disable JS/TS Language Server",
                );

                disable_command
                    .on_click_callback(move || {
                        let state = state.clone();
                        tokio::spawn(async move {
                            disable_ls(&state).await;
                        });
                    })
                    .await;

                disable_command.register().await;
            }
            .await;

            let mut enable_command = Command::new(
                client.clone(),
                state_id,
                "js_ls.enable",
                "Enable JS/TS Language Server",
            );

            enable_command
                .on_click_callback(move || {
                    let state = state.clone();
                    let client = client.clone();
                    let status_bar_item = status_bar_item.clone();
                    tokio::spawn(async move {
                        enable_ls(&state, client.clone(), state_id, status_bar_item).await;
                    });
                })
                .await;

            enable_command.register().await;
        });
    }

    fn unload(&mut self) {
        self.client.unload();
    }

    fn notify(&mut self, message: ClientMessages) {
        let mut client = self.client.clone();
        tokio::spawn(async move { client.process_message(&message).await });
    }
}

pub fn entry(extensions: &mut ExtensionsManager, client: ExtensionClient, state_id: u8) {
    let plugin = Box::new(TSLSPExtension { client, state_id });
    let parent_id = env!("CARGO_PKG_NAME");
    extensions.register(parent_id, plugin);
}

pub fn get_info() -> ManifestInfo {
    ManifestInfo {
        extension: ManifestExtension {
            id: env!("CARGO_PKG_NAME").to_string(),
            name: EXTENSION_NAME.to_string(),
            author: "Marc Espín".to_string(),
            version: env!("CARGO_PKG_VERSION").to_string(),
            repository: "https://github.com/Graviton-Code-Editor/Graviton-App".to_string(),
            main: None,
        },
    }
}
