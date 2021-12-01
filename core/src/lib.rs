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

/// Graviton Core entry point
///
/// # Example
/// ```rust
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
///  // Crate a Configuration with CORS
///  let config = Arc::new(Mutex::new(Configuration::new(DomainsValidation::Disabled)));
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
    config: Arc<Mutex<Configuration>>,
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
    pub fn new(config: Arc<Mutex<Configuration>>, states: Arc<Mutex<StatesList>>) -> Self {
        Self {
            server: Server::new(config.clone(), states.clone()),
            config,
            states,
        }
    }

    /// Start the core
    ///
    /// # Note
    /// This blocks the current thread, you might run this on a separate thread.
    ///
    /// ## Exemple
    /// With tokio:
    /// ```rust
    /// tokio::task::spawn(async move { core.run().await });
    /// ```
    pub async fn run(&self) {
        self.server.run().await;
    }
}
