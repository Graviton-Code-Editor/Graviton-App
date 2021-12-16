pub mod extensions;
pub mod extensions_manager;
pub mod filesystems;
pub mod messaging;
pub mod state;
pub use filesystems::FilesystemErrors;
pub use serde::{
    Deserialize,
    Serialize,
};
pub use state::State;
pub use tokio::{
    self,
    sync::{
        mpsc::Sender,
        Mutex,
    },
};

/// Global errors enum
#[derive(Serialize, Deserialize, Debug)]
pub enum Errors {
    StateNotFound,
    Fs(FilesystemErrors),
    BadToken,
}
