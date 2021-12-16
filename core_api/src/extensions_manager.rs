use std::sync::Arc;

use tokio::sync::Mutex as AsyncMutex;

use crate::extensions::base::Extension;

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

    pub fn register(&mut self, plugin: Box<dyn Extension + Send>) {
        self.extensions.push(Arc::new(AsyncMutex::new(plugin)));
    }
}
