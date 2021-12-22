use tokio::sync::mpsc::Sender;

use crate::messaging::Messages;

/// StatusBarItem
pub struct StatusBarItem {
    id: u8,
    label: String,
    sender: Sender<Messages>,
    state_id: u8,
}

impl StatusBarItem {
    pub fn new(sender: Sender<Messages>, state_id: u8, label: &str) -> Self {
        Self {
            id: 0,
            sender,
            state_id,
            label: label.to_string(),
        }
    }

    pub async fn show(&self) {
        self.sender
            .send(Messages::ShowStatusBarItem {
                state_id: self.state_id,
                statusbar_item_id: self.id,
                label: self.label.clone(),
            })
            .await
            .unwrap();
    }
}
