use serde::{
    Deserialize,
    Serialize,
};

pub mod base;
pub mod client;
pub mod manager;
pub mod manifest;
pub mod modules;

/// Extensions errors
#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum ExtensionErrors {
    ExtensionNotFound,
}
