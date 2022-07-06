use tokio::sync::mpsc::Sender;

use crate::extensions::client::{EventActions, ExtensionClient};
use crate::messaging::{ClientMessages, ServerMessages};

/// Prompt option for the Global Prompt
pub struct Command {
    id: String,
    name: String,
    client: ExtensionClient,
    state_id: u8,
}

impl Command {
    pub fn new(client: ExtensionClient, state_id: u8, id: &str, name: &str) -> Self {
        Self {
            id: id.to_string(),
            client,
            state_id,
            name: name.to_string(),
        }
    }

    pub async fn register(&self) {
        self.client
            .send(ClientMessages::ServerMessage(
                ServerMessages::RegisterCommand {
                    state_id: self.state_id,
                    name: self.name.clone(),
                    id: self.id.clone(),
                },
            ))
            .await
            .unwrap();
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
