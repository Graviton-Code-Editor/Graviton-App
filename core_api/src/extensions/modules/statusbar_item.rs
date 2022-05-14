use std::sync::Arc;

use tokio::sync::Mutex;

use crate::extensions::client::ExtensionClient;
use crate::messaging::Messages;

/// StatusBarItem
#[derive(Clone)]
pub struct StatusBarItem {
    id: String,
    label: Arc<Mutex<String>>,
    client: ExtensionClient,
    state_id: u8,
}

impl StatusBarItem {
    pub fn new(mut client: ExtensionClient, state_id: u8, label: &str) -> Self {
        Self {
            id: client.get_id(),
            client,
            state_id,
            label: Arc::new(Mutex::new(label.to_string())),
        }
    }

    pub async fn show(&self) {
        self.client
            .send(Messages::ShowStatusBarItem {
                state_id: self.state_id,
                statusbar_item_id: self.id.clone(),
                label: self.label.lock().await.to_string(),
            })
            .await
            .unwrap();
    }

    pub async fn hide(&self) {
        self.client
            .send(Messages::HideStatusBarItem {
                state_id: self.state_id,
                statusbar_item_id: self.id.clone(),
            })
            .await
            .unwrap();
    }

    pub async fn set_label(&mut self, label: &str){

        *self.label.lock().await = label.to_string();

        self.show().await
    }
}
