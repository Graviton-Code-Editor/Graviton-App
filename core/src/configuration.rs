use gveditor_core_api::messaging::ClientMessages;
use std::sync::Arc;
use tokio::sync::mpsc::{Receiver, Sender};
use tokio::sync::Mutex;

use crate::handlers::TransportHandler;

/// Configuration for a Graviton Server
pub struct Configuration {
    /// The Transport handler
    pub handler: Arc<Mutex<Box<dyn TransportHandler + Send + Sync>>>,
    /// Sender to the Core Server
    pub server_tx: Option<Sender<ClientMessages>>,
    /// Receiver for the Core Server
    pub server_rx: Option<Receiver<ClientMessages>>,
}

impl Configuration {
    pub fn new(
        handler: Box<dyn TransportHandler + Send + Sync>,
        server_tx: Sender<ClientMessages>,
        server_rx: Receiver<ClientMessages>,
    ) -> Self {
        Self {
            handler: Arc::new(Mutex::new(handler)),
            server_tx: Some(server_tx),
            server_rx: Some(server_rx),
        }
    }
}
