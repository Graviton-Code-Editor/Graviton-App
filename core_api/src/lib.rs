pub mod extensions;
pub mod filesystems;
pub mod messaging;
pub mod state;
pub mod state_persistors;
pub use extensions::ExtensionErrors;
pub use filesystems::FilesystemErrors;
pub use serde::{
    Deserialize,
    Serialize,
};
pub use state::State;
pub use tokio;
pub use tokio::sync::mpsc::Sender;
pub use tokio::sync::Mutex;

/// Global errors enum
#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Errors {
    StateNotFound,
    Fs(FilesystemErrors),
    Ext(ExtensionErrors),
    BadToken,
}
