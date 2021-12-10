use std::sync::Arc;
use tokio::sync::Mutex;

use crate::transports::Transport;

pub struct Configuration {
    pub handler: Arc<Mutex<Box<dyn Transport + Send + Sync>>>,
}

impl Configuration {
    pub fn new(handler: Box<dyn Transport + Send + Sync>) -> Self {
        Self {
            handler: Arc::new(Mutex::new(handler)),
        }
    }
}
