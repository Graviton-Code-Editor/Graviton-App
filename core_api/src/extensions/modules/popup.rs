use tokio::sync::mpsc::Sender;

use crate::messaging::Messages;

/// Dialog-like message
#[allow(dead_code)]
pub struct Popup {
    title: String,
    sender: Sender<Messages>,
}

impl Popup {
    pub fn new(sender: Sender<Messages>, title: &str) -> Self {
        Self {
            sender,
            title: title.to_string(),
        }
    }

    pub fn show(&self) {
        todo!()
    }
}
