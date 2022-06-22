use crate::messaging::ClientMessages;
pub use crate::state_persistors::memory::MemoryPersistor;
use crate::State;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone)]
pub enum TokenFlags {
    All(String),
}

/// Internal list of states
#[derive(Clone, Default)]
pub struct StatesList {
    states: HashMap<u8, Arc<Mutex<State>>>,
    provided_tokens: Vec<TokenFlags>,
}

impl StatesList {
    /// Create a new empty states list
    pub fn new() -> Self {
        Self {
            states: HashMap::new(),
            provided_tokens: Vec::new(),
        }
    }

    pub fn with_tokens(mut self, tokens: &[TokenFlags]) -> Self {
        self.provided_tokens = tokens.to_vec();
        self
    }

    /// Return the state by the given ID if found
    pub fn get_state_by_id(&self, id: u8) -> Option<Arc<Mutex<State>>> {
        self.states.get(&id).cloned()
    }

    /// Return the state by the given ID if found
    pub fn with_state(mut self, state: State) -> Self {
        let mut state = state;

        for token in &self.provided_tokens {
            match token {
                TokenFlags::All(token) => {
                    state.tokens.push(token.clone());
                }
            }
        }

        self.states
            .insert(state.data.id, Arc::new(Mutex::new(state.to_owned())));

        self
    }

    /// Notify all the extensions in a state about a message
    pub async fn notify_extensions(&self, message: ClientMessages) {
        let state_id = message.get_state_id();
        let state = self.states.get(&state_id);
        if let Some(state) = state {
            let state = state.lock().await;
            state.notify_extensions(message);
        }
    }
}
