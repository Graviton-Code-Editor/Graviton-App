use crate::state::StateData;

pub mod file;
pub mod memory;

/// Persistor trait
pub trait Persistor {
    fn load(&mut self) -> StateData;
    fn save(&mut self, data: &StateData);
}
