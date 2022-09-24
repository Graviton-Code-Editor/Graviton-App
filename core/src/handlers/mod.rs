use async_trait::async_trait;
use gveditor_core_api::messaging::{ClientMessages, ServerMessages};
use gveditor_core_api::Mutex;
use std::sync::Arc;
use tokio::sync::mpsc::Sender;

use crate::StatesList;

#[cfg(feature = "http_client")]
mod http;
#[cfg(feature = "http_client")]
pub use http::HTTPHandler;

#[cfg(feature = "local_client")]
mod local;
#[cfg(feature = "local_client")]
pub use local::LocalHandler;

#[async_trait]
pub trait TransportHandler {
    /// Run the handler
    async fn run(&mut self, states: Arc<Mutex<StatesList>>, server_tx: Sender<ClientMessages>);
    /// Send a message through the handler
    async fn send(&self, message: ServerMessages);
}
