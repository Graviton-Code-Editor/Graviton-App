use gveditor_core_api::messaging::ClientMessages;
use std::sync::Arc;
use tokio::sync::mpsc::{Receiver, Sender};
use tokio::sync::Mutex;

use crate::handlers::TransportHandler;

pub type Handler = Arc<Mutex<Box<dyn TransportHandler + Send + Sync>>>;

pub struct Configuration {
    pub handler: Handler,
    pub to_core: Sender<ClientMessages>,
    pub from_core: Option<Receiver<ClientMessages>>,
}

impl Configuration {
    pub fn new(
        handler: Box<dyn TransportHandler + Send + Sync>,
        to_core: Sender<ClientMessages>,
        from_core: Receiver<ClientMessages>,
    ) -> Self {
        Self {
            handler: Arc::new(Mutex::new(handler)),
            to_core,
            from_core: Some(from_core),
        }
    }
}
