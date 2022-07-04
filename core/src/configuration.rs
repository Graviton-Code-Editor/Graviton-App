use gveditor_core_api::messaging::ClientMessages;
use std::sync::Arc;
use tokio::sync::mpsc::{Receiver, Sender};
use tokio::sync::Mutex;

use crate::handlers::TransportHandler;

pub struct Configuration {
    pub handler: Arc<Mutex<Box<dyn TransportHandler + Send + Sync>>>,
    pub to_server: Sender<ClientMessages>,
    pub from_server: Option<Receiver<ClientMessages>>,
}

impl Configuration {
    pub fn new(
        handler: Box<dyn TransportHandler + Send + Sync>,
        to_server: Sender<ClientMessages>,
        from_server: Receiver<ClientMessages>,
    ) -> Self {
        Self {
            handler: Arc::new(Mutex::new(handler)),
            to_server,
            from_server: Some(from_server),
        }
    }
}
