use std::fs;
use std::path::PathBuf;

use crate::states::StateData;

use super::Persistor;

/// File state persistor
#[derive(Clone)]
pub struct FilePersistor {
    /// Where the state is persisted.
    path: PathBuf,
}

impl FilePersistor {
    pub fn new(path: PathBuf) -> Self {
        Self { path }
    }
}

impl Persistor for FilePersistor {
    fn load(&mut self) -> StateData {
        let file_content = fs::read_to_string(&self.path).expect("Failed to read file");
        serde_json::from_str(&file_content).unwrap_or_default()
    }

    fn save(&mut self, state: &StateData) {
        let file_content = serde_json::to_string(&state).unwrap();
        fs::write(&self.path, file_content.as_bytes()).unwrap();
    }
}
