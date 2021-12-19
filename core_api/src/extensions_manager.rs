use std::sync::Arc;

use tokio::sync::mpsc::Sender;
use tokio::sync::Mutex as AsyncMutex;

use crate::extensions::base::Extension;
use crate::messaging::Messages;

/// Manage a group of extensions
#[derive(Default, Clone)]
pub struct ExtensionsManager {
    pub extensions: Vec<Arc<AsyncMutex<Box<dyn Extension + Send>>>>,
}

impl ExtensionsManager {
    pub fn new() -> Self {
        Self {
            extensions: Vec::new(),
        }
    }

    /// Returns a vector of pointers to all extensions instances
    ///
    /// # Arguments
    ///
    /// * `path`     - The directory path from where to load the extensions
    /// * `sender`   -  A mpsc sender to communicate with the core
    /// * `state_id` - The State ID in whidh it was loaded
    ///
    pub async fn load_extensions_from_path(
        &mut self,
        path: &str,
        sender: Sender<Messages>,
        state_id: u8,
    ) -> &mut ExtensionsManager {
        unsafe {
            // Load the extension library
            // NOTE: The library should be saved instead of leaked. WIP
            let lib = Box::leak(Box::new(libloading::Library::new(path).unwrap()));
            // Retrieve the entry function handler
            let entry_func: libloading::Symbol<
                unsafe extern "C" fn(&ExtensionsManager, Sender<Messages>, u8) -> (),
            > = lib.get(b"entry").unwrap();

            entry_func(self, sender, state_id);
        }
        self
    }

    pub fn register(&mut self, plugin: Box<dyn Extension + Send>) {
        self.extensions.push(Arc::new(AsyncMutex::new(plugin)));
    }
}
