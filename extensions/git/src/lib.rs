use git2::Repository;
use gveditor_core_api::extensions::base::{
    Extension,
    ExtensionInfo,
};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::extensions::modules::statusbar_item::StatusBarItem;
use gveditor_core_api::messaging::ExtensionMessages;
use gveditor_core_api::tokio::runtime::Runtime;
use gveditor_core_api::{
    ManifestExtension,
    ManifestInfo,
    Mutex,
};
use std::sync::mpsc::{
    channel,
    Receiver,
    Sender,
};
use std::sync::Arc;
use std::thread;

struct GitExtension {
    client: ExtensionClient,
    state_id: u8,
    rx: Arc<Mutex<Receiver<ExtensionMessages>>>,
    tx: Sender<ExtensionMessages>,
    item: Arc<Mutex<Option<StatusBarItem>>>,
}

impl GitExtension {
    /// Handle ListDir events
    /// Note: The errors should be better handled
    pub async fn handle_list_dir(
        statusbar_item: Arc<Mutex<Option<StatusBarItem>>>,
        client: ExtensionClient,
        state_id: u8,
        path: String,
    ) {
        let repo = Repository::discover(path);
        if let Ok(repo) = repo {
            if let Ok(head) = repo.head() {
                let branch = head.shorthand();
                if let Some(branch) = branch {
                    if let Some(statusbar_item) = &*statusbar_item.lock().await {
                        statusbar_item.hide().await;
                    }
                    let item = StatusBarItem::new(client.clone(), state_id, branch);
                    item.show().await;
                    *statusbar_item.lock().await = Some(item);
                } else {
                    println!("Can't format head");
                }
            } else {
                println!("Head not found");
            }
        } else {
            println!("Repo not found");
        }
    }
}

impl Extension for GitExtension {
    fn get_info(&self) -> ExtensionInfo {
        ExtensionInfo {
            id: env!("CARGO_PKG_NAME").to_string(),
            name: env!("CARGO_PKG_NAME").to_string(),
        }
    }

    fn init(&mut self) {
        let receiver = self.rx.clone();
        let client = self.client.clone();
        let state_id = self.state_id;
        let item = self.item.clone();
        thread::spawn(move || {
            Runtime::new().unwrap().block_on(async move {
                let receiver = receiver.lock().await;
                loop {
                    if let Ok(ExtensionMessages::ListDir(_, fs_name, path, _)) = receiver.recv() {
                        // Only react when using the local file system
                        if fs_name == "local" {
                            Self::handle_list_dir(item.clone(), client.clone(), state_id, path)
                                .await;
                        }
                    }
                }
            });
        });
    }

    fn notify(&mut self, message: ExtensionMessages) {
        self.tx.send(message).unwrap();
    }
}

pub fn entry(extensions: &mut ExtensionsManager, client: ExtensionClient, state_id: u8) {
    let (tx, rx) = channel::<ExtensionMessages>();
    let rx = Arc::new(Mutex::new(rx));
    let plugin = Box::new(GitExtension {
        client,
        state_id,
        rx,
        tx,
        item: Arc::new(Mutex::new(None)),
    });
    let parent_id = env!("CARGO_PKG_NAME");
    extensions.register(parent_id, plugin);
}

pub fn get_info() -> ManifestInfo {
    ManifestInfo {
        extension: ManifestExtension {
            id: env!("CARGO_PKG_NAME").to_string(),
            name: env!("CARGO_PKG_NAME").to_string(),
            author: "Marc Espín".to_string(),
            version: env!("CARGO_PKG_VERSION").to_string(),
            repository: "https://github.com/Graviton-Code-Editor/Graviton-App".to_string(),
            main: None,
        },
    }
}
