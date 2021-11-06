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

    /// Return the state by the given ID if found
    pub fn add_state(&mut self, state: State) {
        self.0.insert(state.id, Arc::new(Mutex::new(state)));
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
    id: u8,
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
        }
    }
}

impl State {
    pub fn new() -> Self {
        Self::default()
    }

    /// Retrieve the specified filesystem by the given name
    pub fn get_fs_by_name(
        &self,
        filesystem: &str,
    ) -> Option<Arc<Mutex<Box<dyn Filesystem + Send>>>> {
        return self.filesystems.get(filesystem).cloned();
    }
}

// NOTE: It would be interesting to implement https://doc.rust-lang.org/std/ops/trait.AddAssign.html
// So it's easier to merge 2 states, old + new
