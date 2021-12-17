use tokio::sync::mpsc::Sender;

use crate::messaging::Messages;

/// Dialog-like message
#[allow(dead_code)]
pub struct Popup {
    id: u8,
    title: String,
    content: String,
    sender: Sender<Messages>,
    state_id: u8,
}

impl Popup {
    pub fn new(sender: Sender<Messages>, state_id: u8, title: &str, content: &str) -> Self {
        Self {
            id: 0,
            sender,
            state_id,
            title: title.to_string(),
            content: content.to_string(),
        }
    }

    pub async fn show(&self) {
        self.sender
            .send(Messages::ShowPopup {
                state_id: self.state_id,
                popup_id: self.id,
                title: self.title.clone(),
                content: self.content.clone(),
            })
            .await
            .unwrap();
    }
}
