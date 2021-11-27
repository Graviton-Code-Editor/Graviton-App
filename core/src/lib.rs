#![feature(async_closure)]
mod configuration;
mod filesystems;
mod server;
mod state;

pub use configuration::Configuration;
pub use jsonrpc_http_server;
use server::Server;
pub use state::{
    State,
    StatesList,
    TokenFlags,
};
use std::sync::{
    Arc,
    Mutex,
};
pub use tokio;

#[allow(dead_code)]
pub struct Core {
    server: Server,
    config: Arc<Mutex<Configuration>>,
    states: Arc<Mutex<StatesList>>,
}

impl Core {
    pub fn new(config: Arc<Mutex<Configuration>>, states: Arc<Mutex<StatesList>>) -> Self {
        Self {
            server: Server::new(config.clone(), states.clone()),
            config,
            states,
        }
    }

    /// Start the core
    pub async fn run(&self) {
        self.server.run().await;
    }
}
