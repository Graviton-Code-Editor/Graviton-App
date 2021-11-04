#![feature(async_closure)]
mod configuration;
mod server;
mod state;

use std::sync::{Arc, Mutex};

pub use configuration::Configuration;
pub use state::StatesList;
pub use state::State;
use server::Server;

/// Entry point of Graviton Core
pub struct Core {
    server: Server,
    config: Arc<Mutex<Configuration>>,
    states: StatesList
}

impl Core {
    pub fn new(config: Arc<Mutex<Configuration>>, states: StatesList) -> Self {
        Self {
            server: Server::new(states.clone()),
            config,
            states
        }
    }

    /// Start the core
    pub async fn run(&self) {
        self.server.run().await;
    }
}
