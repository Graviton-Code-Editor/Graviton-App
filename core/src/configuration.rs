use gveditor_core_api::messaging::Messages;
use std::sync::Arc;
use tokio::sync::mpsc::{Receiver, Sender};
use tokio::sync::Mutex;

use crate::handlers::TransportHandler;

pub type Handler = Arc<Mutex<Box<dyn TransportHandler + Send + Sync>>>;

pub struct Configuration {
    pub handler: Handler,
    pub sender: Sender<Messages>,
    pub receiver: Option<Receiver<Messages>>,
}

impl Configuration {
    pub fn new(
        handler: Box<dyn TransportHandler + Send + Sync>,
        sender: Sender<Messages>,
        receiver: Receiver<Messages>,
    ) -> Self {
        Self {
            handler: Arc::new(Mutex::new(handler)),
            sender,
            receiver: Some(receiver),
        }
    }
}
