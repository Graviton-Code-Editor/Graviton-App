use async_trait::async_trait;
use serde::{
    Deserialize,
    Serialize,
};
use std::sync::{
    Arc,
    Mutex,
};
use tokio::sync::mpsc::Sender;

use crate::{
    State,
    StatesList,
};

mod http;
mod local;

pub use http::HTTPHandler;
pub use local::LocalHandler;

#[async_trait]
pub trait TransportHandler {
    /// Run the handler
    async fn run(
        &mut self,
        states: Arc<Mutex<StatesList>>,
        core_sender: Arc<Mutex<Sender<Messages>>>,
    );
    /// Send a message to the handler
    async fn send(&self, message: Messages);
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "msg_type")]
pub enum Messages {
    // When a frontend listens for changes in a particular state
    // The core will sent the current state for it's particular ID if there is anyone
    // If not, a default state will be sent
    ListenToState {
        // The message author, Core | Client
        trigger: String,
        // The state ID
        state_id: u8,
    },
    StateUpdated {
        state: State,
    },
}

impl Messages {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::ListenToState { state_id, .. } => *state_id,
            Self::StateUpdated { state } => state.id,
        }
    }
}
