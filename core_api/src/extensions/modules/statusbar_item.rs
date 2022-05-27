use std::sync::Arc;

use tokio::sync::mpsc::Sender;
use tokio::sync::Mutex;

use crate::extensions::client::{EventActions, ExtensionClient};
use crate::messaging::{ClientMessages, ServerMessages};

/// StatusBarItem
#[derive(Clone)]
pub struct StatusBarItem {
    pub id: String,
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
            .send(ClientMessages::ServerMessage(
                ServerMessages::ShowStatusBarItem {
                    state_id: self.state_id,
                    id: self.id.clone(),
                    label: self.label.lock().await.to_string(),
                },
            ))
            .await
            .unwrap();
    }

    pub async fn hide(&self) {
        self.client
            .send(ClientMessages::ServerMessage(
                ServerMessages::HideStatusBarItem {
                    state_id: self.state_id,
                    id: self.id.clone(),
                },
            ))
            .await
            .unwrap();
    }

    pub async fn set_label(&mut self, label: &str) {
        *self.label.lock().await = label.to_string();

        self.show().await
    }

    pub async fn on_click_callback(&mut self, callback: impl Fn() + 'static + Send) {
        let mut event_actions = self.client.event_actions.lock().await;
        event_actions.push(EventActions::OnClickCallback {
            id_owner: self.id.clone(),
            callback: Box::new(callback),
        });
    }

    pub async fn on_click(&mut self, sender: Sender<()>) {
        let mut event_actions = self.client.event_actions.lock().await;
        event_actions.push(EventActions::OnClick {
            id_owner: self.id.clone(),
            sender,
        });
    }
}
