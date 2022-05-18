use crate::extensions::client::ExtensionClient;
use crate::messaging::{ClientMessages, ServerMessages};

/// Dialog-like message
pub struct Popup {
    id: String,
    title: String,
    content: String,
    client: ExtensionClient,
    state_id: u8,
}

impl Popup {
    pub fn new(mut client: ExtensionClient, state_id: u8, title: &str, content: &str) -> Self {
        Self {
            id: client.get_id(),
            client,
            state_id,
            title: title.to_string(),
            content: content.to_string(),
        }
    }

    pub async fn show(&self) {
        self.client
            .send(ClientMessages::ServerMessage(ServerMessages::ShowPopup {
                state_id: self.state_id,
                popup_id: self.id.clone(),
                title: self.title.clone(),
                content: self.content.clone(),
            }))
            .await
            .unwrap();
    }
}
