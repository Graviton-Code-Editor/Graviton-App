use std::sync::Arc;

use git2::{Error, Repository, StatusOptions};
use gveditor_core_api::extensions::base::{Extension, ExtensionInfo};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::extensions::modules::statusbar_item::StatusBarItem;
use gveditor_core_api::messaging::{ClientMessages, NotifyExtension, ServerMessages};
use gveditor_core_api::tokio::sync::mpsc::{channel, Receiver, Sender};
use gveditor_core_api::{tokio, ManifestExtension, ManifestInfo, Mutex, Serialize, State};

mod types;

use types::{FileState, FromExtension, ToExtension};

static EXTENSION_NAME: &str = "Git";

async fn send_message_to_client(
    client: &ExtensionClient,
    state_id: u8,
    extension_id: String,
    message: impl Serialize,
) {
    let message = serde_json::to_string(&message).unwrap();
    client
        .send(ClientMessages::ServerMessage(
            ServerMessages::MessageFromExtension {
                state_id,
                extension_id,
                message,
            },
        ))
        .await
        .ok();
}

struct GitExtension {
    rx: Option<Receiver<ClientMessages>>,
    tx: Sender<ClientMessages>,
    status_bar_item: StatusBarItem,
    client: ExtensionClient,
}

impl GitExtension {
    /// Handle ListDir events
    /// Note: The errors should be better handled
    pub fn get_repo_branch(path: String) -> Result<Option<String>, Error> {
        let repo = Repository::discover(path);
        let repo = repo?;
        let head = repo.head()?;
        Ok(head.shorthand().map(|v| v.to_string()))
    }

    pub fn get_repo_status(path: String) -> Result<Vec<FileState>, Error> {
        let repo = Repository::discover(path);
        let repo = repo?;
        let mut files = Vec::new();
        for file in repo
            .statuses(Some(&mut StatusOptions::new()))
            .unwrap()
            .iter()
        {
            let status = file.status();
            if let Some(path) = file.path() {
                files.push(FileState {
                    path: path.to_string(),
                    status: status.bits(),
                });
            }
        }

        Ok(files)
    }

    pub async fn handle_side_panel_messages(
        client: &ExtensionClient,
        state_id: u8,
        extension_id: String,
        message: ToExtension,
    ) {
        match message {
            ToExtension::LoadFilesStates { path } => {
                // Get the current files states
                let files_states = Self::get_repo_status(path.clone());

                // Default message is Repo not found
                let mut message = FromExtension::RepoNotFound { path: path.clone() };

                // Answer with the file states
                if let Ok(files_states) = files_states {
                    message = FromExtension::FilesState { path, files_states };
                }

                // Send the message
                send_message_to_client(client, state_id, extension_id, message).await;
            }
            ToExtension::LoadBranch { path } => {
                // Get the current branch
                let branch = Self::get_repo_branch(path.clone());

                // Default message is Repo not found
                let mut message = FromExtension::RepoNotFound { path: path.clone() };

                // Answer with the found branch
                if let Ok(Some(branch)) = branch {
                    message = FromExtension::Branch { path, name: branch };
                }

                // Send the message
                send_message_to_client(client, state_id, extension_id, message).await;
            }
        }
    }
}

impl Extension for GitExtension {
    fn get_info(&self) -> ExtensionInfo {
        ExtensionInfo {
            id: env!("CARGO_PKG_NAME").to_string(),
            name: EXTENSION_NAME.to_string(),
        }
    }

    fn init(&mut self, _state: Arc<Mutex<State>>) {
        let receiver = self.rx.take();
        let client = self.client.clone();

        if let Some(mut receiver) = receiver {
            let mut status_bar_item = self.status_bar_item.clone();

            tokio::spawn(async move {
                loop {
                    if let Some(message) = receiver.recv().await {
                        match message {
                            ClientMessages::ListDir(_, fs_name, path, _) => {
                                // Only react when using the local file system
                                if fs_name == "local" {
                                    let branch = Self::get_repo_branch(path);
                                    if let Ok(Some(branch)) = branch {
                                        status_bar_item.set_label(&branch).await;
                                    }
                                }
                            }
                            ClientMessages::NotifyExtension(
                                NotifyExtension::ExtensionMessage {
                                    content,
                                    state_id,
                                    extension_id,
                                },
                            ) => {
                                let message: Result<ToExtension, serde_json::Error> =
                                    serde_json::from_str(&content);
                                if let Ok(message) = message {
                                    Self::handle_side_panel_messages(
                                        &client,
                                        state_id,
                                        extension_id,
                                        message,
                                    )
                                    .await;
                                }
                            }
                            _ => {}
                        }
                    }
                }
            });
        }
    }

    fn unload(&mut self) {}

    fn notify(&mut self, message: ClientMessages) {
        let tx = self.tx.clone();
        tokio::spawn(async move {
            tx.send(message).await.unwrap();
        });
    }
}

pub fn entry(extensions: &mut ExtensionsManager, client: ExtensionClient, state_id: u8) {
    let (tx, rx) = channel::<ClientMessages>(1);
    let status_bar_item = StatusBarItem::new(client.clone(), state_id, "");

    let plugin = Box::new(GitExtension {
        rx: Some(rx),
        tx,
        status_bar_item,
        client,
    });
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
