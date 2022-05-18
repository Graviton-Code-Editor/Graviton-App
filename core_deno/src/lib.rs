use async_trait::async_trait;
use deno_core::v8::IsolateHandle;
use events_manager::EventsManager;
use gveditor_core_api::extensions::base::{Extension, ExtensionInfo};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::extensions::manager::{ExtensionsManager, LoadedExtension};
use gveditor_core_api::messaging::ClientMessages;
use gveditor_core_api::{Manifest, ManifestInfo, Mutex, Sender};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::fs;
use tokio::runtime::Runtime;
use tokio_stream::wrappers::ReadDirStream;
use tokio_stream::StreamExt;
use uuid::Uuid;

mod events_manager;
mod exts;
mod main_worker;

use main_worker::create_main_worker;

pub type EventListeners = Arc<Mutex<HashMap<String, HashMap<Uuid, Sender<ClientMessages>>>>>;
pub type WorkerHandle = Arc<Mutex<Option<IsolateHandle>>>;

/// DenoExtension is a wrapper around Graviton extension api that makes use of deno_runtime to execute the extensions
struct DenoExtension {
    main_path: String,
    info: ManifestInfo,
    client: ExtensionClient,
    state_id: u8,
    events_manager: EventsManager,
}

impl DenoExtension {
    pub fn new(
        main_path: &str,
        info: ManifestInfo,
        client: ExtensionClient,
        state_id: u8,
        events_manager: EventsManager,
    ) -> Self {
        Self {
            main_path: main_path.to_string(),
            info,
            client,
            state_id,
            events_manager,
        }
    }
}

impl Extension for DenoExtension {
    fn init(&mut self) {
        let main_path = self.main_path.clone();
        let client = self.client.clone();
        let events_manager = self.events_manager.clone();
        let state_id = self.state_id;

        // TODO: Is there a better way rather than launching it in a different thread?
        std::thread::spawn(move || {
            let r = Runtime::new().unwrap();
            r.block_on(async move {
                let mut worker =
                    create_main_worker(&main_path, client, events_manager.clone(), state_id).await;

                worker.run_event_loop(false).await.ok();
            });
        });

        tracing::info!(
            "Loaded Deno Extension <{}> from {}",
            self.info.extension.name,
            self.main_path
        );
    }

    fn unload(&mut self) {
        self.notify(ClientMessages::Unload(self.state_id));
    }

    fn notify(&mut self, message: ClientMessages) {
        let events_manager = self.events_manager.clone();
        tokio::spawn(async move {
            events_manager.send(message).await.unwrap();
        });
    }

    fn get_info(&self) -> ExtensionInfo {
        ExtensionInfo {
            name: self.info.extension.name.clone(),
            id: self.info.extension.id.clone(),
        }
    }
}

/// Add support for a special method that allows core invokers to execute Deno extensions
#[async_trait]
pub trait DenoExtensionSupport {
    fn load_extension_with_deno(
        &mut self,
        path: &str,
        info: ManifestInfo,
        state_id: u8,
    ) -> &mut ExtensionsManager;
    async fn load_extensions_with_deno_in_directory(
        &mut self,
        path: &str,
        state_id: u8,
    ) -> &mut ExtensionsManager;
}

#[async_trait]
impl DenoExtensionSupport for ExtensionsManager {
    fn load_extension_with_deno(
        &mut self,
        path: &str,
        info: ManifestInfo,
        state_id: u8,
    ) -> &mut ExtensionsManager {
        let client = ExtensionClient::new(
            &info.extension.id.clone(),
            &info.extension.name.clone(),
            self.sender.clone(),
            self.settings_path.clone(),
        );
        let events_manager = EventsManager::new();
        let deno_extension = Box::new(DenoExtension::new(
            path,
            info.clone(),
            client,
            state_id,
            events_manager,
        ));
        self.register(&info.extension.id, deno_extension);
        self.extensions
            .push(LoadedExtension::ManifestBuiltin { info });
        self
    }

    async fn load_extensions_with_deno_in_directory(
        &mut self,
        path: &str,
        state_id: u8,
    ) -> &mut ExtensionsManager {
        let items = fs::read_dir(path).await;

        if let Ok(items) = items {
            let mut items = ReadDirStream::new(items);

            // Iterate over all the found extensions
            while let Some(Ok(item)) = items.next().await {
                let item_path = item.path();
                let manifest_path = item_path.join("Graviton.toml");

                // Get the extension manifest
                let manifest = Manifest::parse(&manifest_path).await;

                if let Ok(manifest) = manifest {
                    // Load it's entry file if specified
                    if let Some(main) = &manifest.info.extension.main {
                        let main_path = item_path.join(main);

                        self.load_extension_with_deno(
                            main_path.to_str().unwrap(),
                            manifest.info.clone(),
                            state_id,
                        );
                    } else {
                        tracing::error!(
                            "Could not register Deno Extension <{}> from {}",
                            manifest.info.extension.name,
                            manifest.location.to_str().unwrap()
                        );
                        // Doesn't have an entry file
                    }
                }
            }
        }

        self
    }
}
