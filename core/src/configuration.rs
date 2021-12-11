use std::sync::Arc;
use tokio::sync::Mutex;

use crate::handlers::TransportHandler;

pub type Handler = Arc<Mutex<Box<dyn TransportHandler + Send + Sync>>>;

pub struct Configuration {
    pub handler: Handler,
}

impl Configuration {
    pub fn new(handler: Box<dyn TransportHandler + Send + Sync>) -> Self {
        Self {
            handler: Arc::new(Mutex::new(handler)),
        }
    }
}
