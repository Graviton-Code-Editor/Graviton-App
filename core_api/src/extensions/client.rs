use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tokio::sync::mpsc::error::SendError;
use tokio::sync::mpsc::Sender;
use tokio::sync::Mutex as AsyncMutex;

use crate::messaging::{ClientMessages, ServerMessages, UIEvent};
use crate::tokio::sync::mpsc::Sender as AsyncSender;
use crate::LanguageServer;

use super::settings::ExtensionSettings;

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

#[derive(Clone)]
pub struct ExtensionClient {
    extension_id: String,
    name: String,
    id_count: Arc<Mutex<i32>>,
    sender: AsyncSender<ClientMessages>,
    settings_path: Option<PathBuf>,
    pub event_actions: Arc<AsyncMutex<Vec<EventActions>>>,
}

impl ExtensionClient {
    pub fn new(
        extension_id: &str,
        name: &str,
        sender: AsyncSender<ClientMessages>,
        settings_path: Option<PathBuf>,
    ) -> Self {
        Self {
            extension_id: extension_id.to_string(),
            name: name.to_string(),
            id_count: Arc::new(Mutex::new(0)),
            sender,
            // TODO(marc2332) This should also take the State ID
            settings_path: settings_path.map(|path| path.join(extension_id)),
            event_actions: Arc::new(AsyncMutex::new(Vec::new())),
        }
    }

    // TODO(marc2332) Remove this and use UUID
    pub fn get_id(&mut self) -> String {
        *self.id_count.lock().unwrap() += 1;
        format!("{}/{}", self.name, self.id_count.lock().unwrap())
    }

    pub async fn send(&self, message: ClientMessages) -> Result<(), SendError<ClientMessages>> {
        self.sender.send(message).await
    }

    pub async fn register_language_server(
        &self,
        state_id: u8,
        languages: HashMap<String, LanguageServer>,
    ) -> Result<(), SendError<ClientMessages>> {
        self.sender
            .send(ClientMessages::ServerMessage(
                ServerMessages::RegisterLanguageServers {
                    state_id,
                    languages,
                    extension_id: self.extension_id.clone(),
                },
            ))
            .await
    }

    pub async fn get_settings(&self) -> Option<ExtensionSettings> {
        let path = self.settings_path.as_ref()?;
        Some(ExtensionSettings::new(path.clone()).await)
    }

    pub async fn process_message(&mut self, message: &ClientMessages) {
        let actions = &mut *self.event_actions.lock().await;
        if let ClientMessages::UIEvent(UIEvent::StatusBarItemClicked { id, .. }) = message {
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
