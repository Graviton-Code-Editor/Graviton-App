#![feature(async_closure)]
#![feature(associated_type_defaults)]
mod configuration;
pub mod handlers;
mod server;

pub use configuration::Configuration;
use gveditor_core_api::state::StatesList;
pub use server::{
    gen_client,
    RPCResult,
    Server,
};
use std::sync::{
    Arc,
    Mutex,
};
pub use {
    jsonrpc_core_client,
    jsonrpc_http_server,
    tokio,
};

/// Graviton Core entry point
///
/// # Example
/// ```rust
/// # use std::sync::{Arc, Mutex};
/// # use gveditor_core::{
///     # handlers::HTTPHandler,
///     # Configuration,
///     # Core,
/// # };
///  # use gveditor_core_api::{
///     # extensions::manager::ExtensionsManager,
///     # messaging::Messages,
///     # state::{
///     #    StatesList,
///     #    TokenFlags,
///     #    MemoryPersistor,
///     # },
///     # State
///  # };
/// # use tokio::sync::{
///    # mpsc::channel,
///    # Mutex as AsyncMutex
/// # };
///
///  let (to_core, from_core) = channel::<Messages>(1);
///  let from_core = Arc::new(AsyncMutex::new(from_core));
///
///  // A pointer to a StatesList
///  let states = {
///     // A basic State with ID '1' and no extensions
///     let sample_state = State::new(1, ExtensionsManager::new(to_core.clone()), Box::new(MemoryPersistor::new()));
///
///     // A StatesList with the previous state
///     let states = StatesList::new()
///         .with_state(sample_state);
///
///     Arc::new(Mutex::new(states))
///  };
///  
///  // Crate a HTTP TransportHandler and a configuration
///  let http_handler = HTTPHandler::builder().build();
///
///  // Create the configuration
///  let config = Configuration::new(Box::new(http_handler), to_core, from_core);
///
///  // Create a Core
///  let core = Core::new(config, states);
///
///  // Run the core (this blocks the thread)
///  core.run();
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

    /// Runs the defined handler and the server
    pub async fn run(&self) {
        self.server.run().await;
    }
}
