pub mod extensions;
pub mod filesystems;
pub mod language_servers;
pub mod messaging;
pub mod state_persistors;
pub mod states;
pub mod terminal_shells;
pub use extensions::manifest::{Manifest, ManifestErrors, ManifestExtension, ManifestInfo};
pub use extensions::ExtensionErrors;
pub use filesystems::FilesystemErrors;
pub use language_servers::LanguageServer;
pub use serde::{Deserialize, Serialize};
pub use states::State;
pub use tokio::sync::mpsc::Sender;
pub use tokio::sync::Mutex;
pub use {serde, tokio};

/// Global errors enum
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub enum Errors {
    StateNotFound,
    Fs(FilesystemErrors),
    Ext(ExtensionErrors),
    BadToken,
}
