use git2::{Repository, Error};
use gveditor_core_api::extensions::base::{Extension, ExtensionInfo};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::extensions::modules::statusbar_item::StatusBarItem;
use gveditor_core_api::messaging::ExtensionMessages;
use gveditor_core_api::tokio::sync::mpsc::{Receiver, Sender, channel};
use gveditor_core_api::{ManifestExtension, ManifestInfo, Mutex, tokio};
use std::sync::Arc;

struct GitExtension {
    rx: Arc<Mutex<Receiver<ExtensionMessages>>>,
    tx: Sender<ExtensionMessages>,
    status_bar_item: StatusBarItem,
}

impl GitExtension {
    /// Handle ListDir events
    /// Note: The errors should be better handled
    pub fn get_repo_branch(path: String) -> Result<Option<String>, Error> {
        let repo = Repository::discover(path);
        let repo = repo?;
        let head = repo.head()?;
        Ok(head.shorthand().map(|v|v.to_string()))
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
        let mut status_bar_item = self.status_bar_item.clone();
        tokio::spawn(async move {
            let mut receiver = receiver.lock().await;
            loop {
                if let Some(ExtensionMessages::ListDir(_, fs_name, path, _)) = receiver.recv().await {
                    // Only react when using the local file system
                    if fs_name == "local" {
                        let branch = Self::get_repo_branch(path);
                        if let Ok(Some(branch)) = branch {
                            status_bar_item.set_label(&branch).await;
                        }
                    }
                }
            }
        });
    }

    fn unload(&mut self) {}

    fn notify(&mut self, message: ExtensionMessages) {
        let tx = self.tx.clone();
        tokio::spawn(async move {
            tx.send(message).await.unwrap();
        });
    }
}

pub fn entry(extensions: &mut ExtensionsManager, client: ExtensionClient, state_id: u8) {
    let (tx, rx) = channel::<ExtensionMessages>(1);
    let rx = Arc::new(Mutex::new(rx));
    let status_bar_item = StatusBarItem::new(client, state_id, "");
    let plugin = Box::new(GitExtension {
        rx,
        tx,
        status_bar_item,
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
