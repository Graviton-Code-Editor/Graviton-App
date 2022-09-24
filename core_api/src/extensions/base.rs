use std::sync::Arc;

use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;

use crate::{messaging::ClientMessages, State};

/// Information about a extension instance
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub struct ExtensionInfo {
    pub id: String,
    pub name: String,
}

/// Extensions structure
pub trait Extension {
    /// Init method of the extension
    /// This will be called when the extension is loaded
    fn init(&mut self, state: Arc<Mutex<State>>);

    /// Unload method of the extension
    /// This will be called when the extension is unloaded
    fn unload(&mut self);

    /// Forward messages to the extension
    fn notify(&mut self, message: ClientMessages);

    /// Retrieve info from the exension
    fn get_info(&self) -> ExtensionInfo;
}
