#![feature(async_closure)]
mod configuration;
mod filesystems;
mod server;
mod state;

use std::sync::{
    Arc,
    Mutex,
};
pub use configuration::Configuration;
use server::Server;
pub use state::{
    State,
    StatesList,
};

#[allow(dead_code)]
pub struct Core {
    server: Server,
    config: Arc<Mutex<Configuration>>,
    states: StatesList,
}

impl Core {
    pub fn new(config: Arc<Mutex<Configuration>>, states: StatesList) -> Self {
        Self {
            server: Server::new(states.clone()),
            config,
            states,
        }
    }

    /// Start the core
    pub async fn run(&self) {
        self.server.run().await;
    }
}
