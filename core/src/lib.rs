#![feature(async_closure)]
#![feature(associated_type_defaults)]
mod configuration;
pub mod filesystems;
pub mod handlers;
mod server;
mod state;

pub use configuration::Configuration;
pub use jsonrpc_core_client;
pub use jsonrpc_http_server;
pub use server::{
    gen_client,
    Errors,
    RPCResult,
    Server,
};
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

/// Graviton Core entry point
///
/// # Example
/// ```rust
/// use std::sync::{Arc, Mutex};
/// use gveditor_core::{
///     jsonrpc_http_server::DomainsValidation,
///     tokio,
///     Configuration,
///     Core,
///     State,
///     StatesList,
///     TokenFlags,
///     handlers::{ TransportHandler, HTTPHandler }
/// };
///
///  // A pointer to a StatesList
///  let states = {
///     // A basic State with ID '1' and no extensions
///     let sample_state = State::new(1, vec![]);
///
///     // A StatesList with the previous state
///     let states = StatesList::new()
///         .with_state(sample_state);
///     Arc::new(Mutex::new(states))
///  };
///  
///  // Crate a HTTP TransportHandler and a configuration
///  let http_handler = HTTPHandler::new(DomainsValidation::Disabled);
///  let http_handler: Box<dyn TransportHandler + Send + Sync> = Box::new(http_handler);
///  let config = Configuration::new(http_handler);
///
///  // Create a Core
///  let core = Core::new(config, states);
///
///  // Run the core
///  core.run();
///
/// ```
///
#[allow(dead_code)]
pub struct Core {
    server: Server,
    states: Arc<Mutex<StatesList>>,
}

impl Core {
    /// Create a new Core
    ///
    /// # Arguments
    ///
    /// * `config`   - The Core configuration
    /// * `states`   - The States list the Core will launch with
    ///
    pub fn new(config: Configuration, states: Arc<Mutex<StatesList>>) -> Self {
        Self {
            server: Server::new(config, states.clone()),
            states,
        }
    }

    /// Start the core
    ///
    /// # Note
    /// This blocks the current thread, you might prefer to run this on a separate thread.
    ///
    pub async fn run(&self) {
        self.server.run().await;
    }
}
