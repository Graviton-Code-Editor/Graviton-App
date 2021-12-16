use gveditor_core_api::messaging::Messages;
use std::sync::Arc;
use tokio::sync::{
    mpsc::{
        Receiver,
        Sender,
    },
    Mutex as AsyncMutex,
};

use crate::handlers::TransportHandler;

pub type Handler = Arc<AsyncMutex<Box<dyn TransportHandler + Send + Sync>>>;

pub struct Configuration {
    pub handler: Handler,
    pub sender: Sender<Messages>,
    pub receiver: Arc<AsyncMutex<Receiver<Messages>>>,
}

impl Configuration {
    pub fn new(
        handler: Box<dyn TransportHandler + Send + Sync>,
        sender: Sender<Messages>,
        receiver: Arc<AsyncMutex<Receiver<Messages>>>,
    ) -> Self {
        Self {
            handler: Arc::new(AsyncMutex::new(handler)),
            sender,
            receiver,
        }
    }
}
