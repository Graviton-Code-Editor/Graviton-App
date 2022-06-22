use crate::states::StateData;

pub mod file;
pub mod memory;

/// Persistor trait
/// Make these methods async
pub trait Persistor {
    fn load(&mut self) -> StateData;
    fn save(&mut self, data: &StateData);
}
