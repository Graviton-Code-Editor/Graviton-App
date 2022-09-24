use serde::{Deserialize, Serialize};

pub mod base;
pub mod client;
pub mod manager;
pub mod manifest;
pub mod modules;
pub mod settings;

/// Extensions errors
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub enum ExtensionErrors {
    ExtensionNotFound,
}
