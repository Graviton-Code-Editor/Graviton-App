use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::mpsc::error::SendError;
use tokio::sync::mpsc::Sender;
use tokio::sync::Mutex;

use crate::messaging::ClientMessages;

use super::settings::ExtensionSettings;
use uuid::Uuid;

pub enum EventActions {
    OnClickCallback {
        id_owner: String,
        callback: Box<dyn Fn() + Send>,
    },
    OnClick {
        id_owner: String,
        sender: Sender<()>,
    },
    Nothing,
}

/// Client for the Core and the frontend, for extensions
#[derive(Clone)]
pub struct ExtensionClient {
    pub name: String,
    sender: Sender<ClientMessages>,
    settings_path: Option<PathBuf>,
    pub event_actions: Arc<Mutex<Vec<EventActions>>>,
}

impl ExtensionClient {
    pub fn new(
        extension_id: &str,
        name: &str,
        sender: Sender<ClientMessages>,
        settings_path: Option<PathBuf>,
    ) -> Self {
        Self {
            name: name.to_string(),
            sender,
            // TODO(marc2332) This should also take the State ID
            settings_path: settings_path.map(|path| path.join(extension_id)),
            event_actions: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub fn get_id(&mut self) -> String {
        format!("{}/{}", self.name, Uuid::new_v4())
    }

    pub async fn send(&self, message: ClientMessages) -> Result<(), SendError<ClientMessages>> {
        self.sender.send(message).await
    }

    pub async fn get_settings(&self) -> Option<ExtensionSettings> {
        let path = self.settings_path.as_ref()?;
        Some(ExtensionSettings::new(path.clone()).await)
    }

    pub fn unload(&mut self) {
        self.event_actions = Arc::new(Mutex::new(Vec::new()));
    }

    pub async fn process_message(&mut self, message: &ClientMessages) {
        let actions = &mut *self.event_actions.lock().await;
        if let ClientMessages::UIEvent(event) = message {
            let id = event.get_owner_id();
            actions.retain(|action| match action {
                EventActions::OnClickCallback { id_owner, callback } => {
                    if id_owner == id {
                        callback()
                    }
                    true
                }
                EventActions::OnClick { id_owner, sender } => {
                    if id_owner == id {
                        let sender = sender.clone();
                        tokio::spawn(async move {
                            sender.send(()).await.unwrap();
                        });
                        false
                    } else {
                        true
                    }
                }
                _ => true,
            });
        }
    }
}
