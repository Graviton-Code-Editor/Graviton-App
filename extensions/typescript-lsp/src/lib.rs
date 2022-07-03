use gveditor_core_api::extensions::base::{Extension, ExtensionInfo};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::messaging::ClientMessages;
use gveditor_core_api::{tokio, ManifestExtension, ManifestInfo, Mutex, State};
use lsp::JSTSLanguageServerBuilder;
use std::sync::Arc;

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
            let mut state = state.lock().await;

            state.language_server_builders.insert(
                "typescript".to_string(),
                Arc::new(Mutex::new(Box::new(JSTSLanguageServerBuilder {
                    client,
                    state_id,
                }))),
            )
        });
    }

    fn unload(&mut self) {}

    fn notify(&mut self, _message: ClientMessages) {}
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
