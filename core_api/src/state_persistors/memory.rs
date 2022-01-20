use crate::state::StateData;

use super::Persistor;

/// In-memory read and writer
/// Useless for now
#[derive(Clone, Default)]
pub struct MemoryPersistor {
    data: StateData,
}

impl MemoryPersistor {
    pub fn new() -> Self {
        Self::default()
    }
}

impl Persistor for MemoryPersistor {
    fn load(&mut self) -> StateData {
        self.data.clone()
    }

    fn save(&mut self, data: &StateData) {
        self.data = data.clone();
    }
}
