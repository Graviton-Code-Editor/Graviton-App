use std::sync::{
    Arc,
    Mutex,
};
use tokio::sync::mpsc::error::SendError;

use crate::messaging::Messages;
use crate::tokio::sync::mpsc::Sender as AsyncSender;

#[derive(Clone)]
pub struct ExtensionClient {
    name: String,
    id_count: Arc<Mutex<i32>>,
    sender: AsyncSender<Messages>,
}

impl ExtensionClient {
    pub fn new(name: &str, sender: AsyncSender<Messages>) -> Self {
        Self {
            name: name.to_string(),
            id_count: Arc::new(Mutex::new(0)),
            sender,
        }
    }

    pub fn get_id(&mut self) -> String {
        *self.id_count.lock().unwrap() += 1;
        format!("{}/{}", self.name, self.id_count.lock().unwrap())
    }

    pub async fn send(&self, message: Messages) -> Result<(), SendError<Messages>> {
        self.sender.send(message).await
    }
}
