#![feature(async_closure)]

pub mod extensions;
pub mod filesystems;
pub mod messaging;
pub mod state;
pub mod state_persistors;
pub use extensions::manifest::{
    Manifest,
    ManifestErrors,
    ManifestExtension,
    ManifestInfo,
};
pub use extensions::ExtensionErrors;
pub use filesystems::FilesystemErrors;
pub use serde::{
    Deserialize,
    Serialize,
};
pub use state::State;
pub use tokio::sync::mpsc::Sender;
pub use tokio::sync::Mutex;
pub use {
    serde,
    serde_derive,
    tokio,
};

/// Global errors enum
#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Errors {
    StateNotFound,
    Fs(FilesystemErrors),
    Ext(ExtensionErrors),
    BadToken,
}
