use crate::states::StateData;

pub mod file;
pub mod memory;

// IDEA(marc2332) Make this trait async.

/// Persistor trait
pub trait Persistor {
    /// Retrieve data
    fn load(&mut self) -> StateData;

    /// Persist data
    fn save(&mut self, data: &StateData);
}
