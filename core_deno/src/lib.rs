#![feature(map_try_insert)]

use std::collections::HashMap;
use std::sync::Arc;

use gveditor_core_api::{
    Manifest,
    ManifestInfo,
    Mutex,
    Sender,
};
use tokio::fs;
use tokio::runtime::Runtime;

use gveditor_core_api::extensions::base::{
    Extension,
    ExtensionInfo,
};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::extensions::manager::{
    ExtensionsManager,
    LoadedExtension,
};
use gveditor_core_api::messaging::ExtensionMessages;

mod main_worker;

mod worker_extension;

use main_worker::create_main_worker;

use async_trait::async_trait;

use tokio::sync::mpsc;
use tokio_stream::wrappers::ReadDirStream;
use tokio_stream::StreamExt;
use uuid::Uuid;

pub type EventListeners = Arc<Mutex<HashMap<String, HashMap<Uuid, Sender<ExtensionMessages>>>>>;

/// DenoExtension is a wrapper around Graviton extension api that makes use of deno_runtime to execute the extensions
#[allow(dead_code)]
struct DenoExtension {
    main_path: String,
    info: ManifestInfo,
    client: ExtensionClient,
    state_id: u8,
    listeners: EventListeners,
}

impl DenoExtension {
    pub fn new(
        main_path: &str,
        info: ManifestInfo,
        client: ExtensionClient,
        state_id: u8,
        listeners: EventListeners,
    ) -> Self {
        Self {
            main_path: main_path.to_string(),
            info,
            client,
            state_id,
            listeners,
        }
    }
}

impl Extension for DenoExtension {
    fn init(&mut self) {
        let main_path = self.main_path.clone();
        let client = self.client.clone();
        let listeners = self.listeners.clone();
        let handle_p = Arc::new(Mutex::new(None));

        let worker_handle = handle_p.clone();
        let worker_listeners = listeners.clone();

        // TODO: Is there a better way rather than launching it in a different thread?
        std::thread::spawn(move || {
            let r = Runtime::new().unwrap();
            r.block_on(async move {
                let mut worker =
                    create_main_worker(&main_path, client, worker_listeners.clone()).await;

                let handle = worker.js_runtime.handle_scope().thread_safe_handle();

                worker_handle.lock().await.replace(handle);

                worker.run_event_loop(false).await.ok();
            });
        });

        // Register an event listener on "unload" that will terminate the worker
        tokio::spawn(async move {
            let mut lists = listeners.lock().await;

            lists.try_insert("unload".to_string(), HashMap::new()).ok();

            let (s, mut r) = mpsc::channel(1);
            let s_id = Uuid::new_v4();

            lists.get_mut("unload").unwrap().insert(s_id, s);

            drop(lists);

            // Wait for the unload event
            r.recv().await;

            // Clear up all listeners
            listeners
                .lock()
                .await
                .get_mut("unload")
                .unwrap()
                .remove(&s_id);
            // TODO: Clear all other listeners

            // Close the worker forcefully
            if let Some(handle) = &*handle_p.lock().await {
                handle.terminate_execution();
            }
        });

        tracing::info!(
            "Loaded Deno Extension <{}> from {}",
            self.info.extension.name,
            self.main_path
        );
    }

    fn unload(&mut self) {
        self.notify(ExtensionMessages::Unload(self.state_id));
    }

    fn notify(&mut self, message: ExtensionMessages) {
        let listeners = self.listeners.clone();
        tokio::spawn(async move {
            let listeners = listeners.lock().await;
            let event_name = message.get_name();
            let event_listeners = listeners.get(event_name);

            if let Some(event_listeners) = event_listeners {
                for listener in event_listeners.values() {
                    listener.send(message.clone()).await.ok();
                }
            }
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
        let client = ExtensionClient::new(&info.extension.name.clone(), self.sender.clone());
        let listeners = Arc::new(Mutex::new(HashMap::<
            String,
            HashMap<Uuid, Sender<ExtensionMessages>>,
        >::new()));
        let deno_extension = Box::new(DenoExtension::new(
            path,
            info.clone(),
            client,
            state_id,
            listeners,
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
                        let client = ExtensionClient::new(
                            &manifest.info.extension.name,
                            self.sender.clone(),
                        );
                        let main_path = item_path.join(main);
                        let listeners = Arc::new(Mutex::new(HashMap::<
                            String,
                            HashMap<Uuid, Sender<ExtensionMessages>>,
                        >::new()));
                        let deno_extension = Box::new(DenoExtension::new(
                            main_path.to_str().unwrap(),
                            manifest.info.clone(),
                            client,
                            state_id,
                            listeners,
                        ));
                        self.register(&manifest.info.extension.id, deno_extension);

                        self.extensions
                            .push(LoadedExtension::ManifestFile { manifest });
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
