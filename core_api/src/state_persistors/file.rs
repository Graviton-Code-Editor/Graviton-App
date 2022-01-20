use std::fs;
use std::path::PathBuf;

use crate::state::StateData;

use super::Persistor;

/// File state persistor
/// Useless for now
#[derive(Clone)]
pub struct FilePersistor {
    path: PathBuf,
}

impl FilePersistor {
    pub fn new(path: PathBuf) -> Self {
        Self { path }
    }
}

/// Note: I am opening the file on every read and write operation to avoid blocking when multiple states are using the same file (e.g. in the Desktop app situation with multiple windows windows)
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
