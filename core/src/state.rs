use std::{
    collections::HashMap,
    sync::{
        Arc,
        Mutex,
    },
};

use serde::{
    Deserialize,
    Serialize,
};

/// Internal list of states
#[derive(Clone, Default)]
pub struct StatesList(HashMap<u8, Arc<Mutex<State>>>);

impl StatesList {
    /// Create a new empty states list
    pub fn new() -> Self {
        Self(HashMap::new())
    }

    /// Return the state by the given ID if found
    pub fn get_state_by_id(&self, id: u8) -> Option<Arc<Mutex<State>>> {
        self.0.get(&id).cloned()
    }
}

/// a Tab state
#[derive(Serialize, Deserialize, Clone)]
struct Tab {}

/// A state is like a small configuration, like a profile
/// It stores what tabs do you have open, what extensions to load
#[derive(Serialize, Deserialize, Clone, Default)]
pub struct State {
    opened_tabs: Vec<Tab>,
}

impl State {
    pub fn new() -> Self {
        Self {
            opened_tabs: Vec::new(),
        }
    }
}

// It would be interesting to implement https://doc.rust-lang.org/std/ops/trait.AddAssign.html
// So it's easier to merge 2 states, old + new
