use std::sync::Arc;

use gveditor_core_api::extensions::base::{Extension, ExtensionInfo};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::messaging::ClientMessages;
use gveditor_core_api::terminal_shells::TerminalShellBuilderInfo;
use gveditor_core_api::{tokio, ManifestExtension, ManifestInfo, Mutex, State};
use native::NativeShellBuilder;

mod native;

static EXTENSION_NAME: &str = "Native Shell";

struct NativeShellExtension {
    pub state_id: u8,
    pub client: ExtensionClient,
}

impl Extension for NativeShellExtension {
    fn get_info(&self) -> ExtensionInfo {
        ExtensionInfo {
            id: env!("CARGO_PKG_NAME").to_string(),
            name: EXTENSION_NAME.to_string(),
        }
    }

    fn init(&mut self, state: Arc<Mutex<State>>) {
        let state_id = self.state_id;
        let client = self.client.clone();
        tokio::spawn(async move {
            #[cfg(any(target_os = "windows"))]
            state.lock().await.terminal_shell_builders.insert(
                "Powershell".to_string(),
                Arc::new(Mutex::new(Box::new(NativeShellBuilder {
                    client: client.clone(),
                    state_id,
                    command: "powershell.exe".to_string(),
                    info: TerminalShellBuilderInfo {
                        name: "Powershell".to_string(),
                        id: "Powershell".to_string(),
                    },
                }))),
            );

            #[cfg(any(target_os = "windows"))]
            state.lock().await.terminal_shell_builders.insert(
                "cmd".to_string(),
                Arc::new(Mutex::new(Box::new(NativeShellBuilder {
                    client: client.clone(),
                    state_id,
                    command: "cmd.exe".to_string(),
                    info: TerminalShellBuilderInfo {
                        name: "Command Prompt".to_string(),
                        id: "cmd".to_string(),
                    },
                }))),
            );

            // TODO(marc2332): Add bash shell for Linux and MacOS
        });
    }

    fn unload(&mut self) {}

    fn notify(&mut self, _message: ClientMessages) {}
}

pub fn entry(extensions: &mut ExtensionsManager, client: ExtensionClient, state_id: u8) {
    let plugin = Box::new(NativeShellExtension { client, state_id });

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
