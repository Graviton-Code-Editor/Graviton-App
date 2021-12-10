use async_trait::async_trait;
use serde::{
    Deserialize,
    Serialize,
};
use std::sync::{
    Arc,
    Mutex,
};

use crate::{
    State,
    StatesList,
};

mod http;
mod local;

pub use http::HTTPHandler;
pub use local::LocalHandler;

#[async_trait]
pub trait Transport {
    async fn run(&self, config: Arc<Mutex<StatesList>>);
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
