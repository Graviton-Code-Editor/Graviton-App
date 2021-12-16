use async_trait::async_trait;
use gveditor_core_api::messaging::Messages;
use std::sync::{
    Arc,
    Mutex,
};
use tokio::sync::mpsc::Sender;

use crate::StatesList;

mod http;
mod local;

pub use http::HTTPHandler;
pub use local::LocalHandler;

#[async_trait]
pub trait TransportHandler {
    /// Run the handler
    async fn run(&mut self, states: Arc<Mutex<StatesList>>, core_sender: Sender<Messages>);
    /// Send a message to the handler
    async fn send(&self, message: Messages);
}
