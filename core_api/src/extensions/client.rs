use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tokio::sync::mpsc::error::SendError;

use crate::messaging::Messages;
use crate::tokio::sync::mpsc::Sender as AsyncSender;
use crate::LanguageServer;

use super::settings::ExtensionSettings;

#[derive(Clone)]
pub struct ExtensionClient {
    extension_id: String,
    name: String,
    id_count: Arc<Mutex<i32>>,
    sender: AsyncSender<Messages>,
    #[allow(dead_code)]
    settings_path: Option<PathBuf>,
}

impl ExtensionClient {
    pub fn new(
        extension_id: &str,
        name: &str,
        sender: AsyncSender<Messages>,
        settings_path: Option<PathBuf>,
    ) -> Self {
        Self {
            extension_id: extension_id.to_string(),
            name: name.to_string(),
            id_count: Arc::new(Mutex::new(0)),
            sender,
            settings_path: settings_path.map(|path| path.join(extension_id)),
        }
    }

    pub fn get_id(&mut self) -> String {
        *self.id_count.lock().unwrap() += 1;
        format!("{}/{}", self.name, self.id_count.lock().unwrap())
    }

    pub async fn send(&self, message: Messages) -> Result<(), SendError<Messages>> {
        self.sender.send(message).await
    }

    pub async fn register_language_server(
        &self,
        state_id: u8,
        languages: HashMap<String, LanguageServer>,
    ) -> Result<(), SendError<Messages>> {
        self.sender
            .send(Messages::RegisterLanguageServers {
                state_id,
                languages,
                extension_id: self.extension_id.clone(),
            })
            .await
    }

    #[allow(dead_code)]
    pub async fn get_settings(&self) -> Option<ExtensionSettings> {
        let path = self.settings_path.as_ref()?;
        Some(ExtensionSettings::new(path.clone()).await)
    }
}
