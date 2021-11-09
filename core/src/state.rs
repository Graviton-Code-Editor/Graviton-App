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

use crate::filesystems::{
    Filesystem,
    LocalFilesystem,
};

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

    pub fn with_tokens(&mut self, tokens: &[TokenFlags]) -> &mut Self {
        self.provided_tokens = tokens.to_vec();
        self
    }

    /// Return the state by the given ID if found
    pub fn get_state_by_id(&self, id: u8) -> Option<Arc<Mutex<State>>> {
        self.states.get(&id).cloned()
    }

    /// Return the state by the given ID if found
    pub fn add_state(&mut self, state: &mut State) {
        for token in &self.provided_tokens {
            match token {
                TokenFlags::All(token) => {
                    state.tokens.push(token.clone());
                }
            }
        }

        self.states
            .insert(state.id, Arc::new(Mutex::new(state.to_owned())));
    }
}

/// a Tab state
#[derive(Serialize, Deserialize, Clone)]
struct Tab {}

/// A state is like a small configuration, like a profile
/// It stores what tabs do you have open, what extensions to load
#[derive(Serialize, Deserialize, Clone)]
pub struct State {
    #[serde(skip_serializing, skip_deserializing)]
    filesystems: HashMap<String, Arc<Mutex<Box<dyn Filesystem + Send>>>>,
    opened_tabs: Vec<Tab>,
    pub id: u8,
    tokens: Vec<String>,
}

impl Default for State {
    /// The default constructor will include:
    /// - LocalFilesystem
    fn default() -> Self {
        let mut filesystems = HashMap::new();

        // Support the local filesystem by default
        let local_fs: Box<dyn Filesystem + Send> = Box::new(LocalFilesystem::new());
        filesystems.insert("local".to_string(), Arc::new(Mutex::new(local_fs)));

        Self {
            id: 1,
            filesystems,
            opened_tabs: Vec::new(),
            tokens: Vec::new(),
        }
    }
}

impl State {
    pub fn new(id: u8) -> Self {
        State {
            id,
            ..Default::default()
        }
    }

    /// Retrieve the specified filesystem by the given name
    pub fn get_fs_by_name(
        &self,
        filesystem: &str,
    ) -> Option<Arc<Mutex<Box<dyn Filesystem + Send>>>> {
        return self.filesystems.get(filesystem).cloned();
    }

    pub fn has_token(&self, token: &str) -> bool {
        self.tokens.contains(&token.to_owned())
    }
}

// NOTE: It would be interesting to implement https://doc.rust-lang.org/std/ops/trait.AddAssign.html
// So it's easier to merge 2 states, old + new
