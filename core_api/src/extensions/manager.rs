use std::sync::Arc;

use tokio::sync::mpsc::{
    channel,
    Sender,
};
use tokio::sync::Mutex as AsyncMutex;

use crate::extensions::base::Extension;
use crate::messaging::Messages;
use crate::{
    Manifest,
    ManifestInfo,
};

use super::base::ExtensionInfo;
use super::client::ExtensionClient;

/// Manage a group of extensions
#[derive(Clone)]
pub struct ExtensionsManager {
    pub extensions: Vec<LoadedExtension>,
    pub sender: Sender<Messages>,
}

impl Default for ExtensionsManager {
    fn default() -> Self {
        let (to_core, _) = channel::<Messages>(1);
        Self::new(to_core)
    }
}

impl ExtensionsManager {
    pub fn new(sender: Sender<Messages>) -> Self {
        Self {
            extensions: Vec::new(),
            sender,
        }
    }

    pub async fn load_extension_from_entry(
        &mut self,
        entry: fn(&mut Self, ExtensionClient, u8),
        info: ManifestInfo,
        state_id: u8,
    ) -> &mut ExtensionsManager {
        let client = ExtensionClient::new(&info.extension.name, self.sender.clone());
        entry(self, client, state_id);
        self.extensions
            .push(LoadedExtension::ManifestBuiltin { info });
        self
    }

    /// Load a extension
    pub fn register(&mut self, parent_id: &str, plugin: Box<dyn Extension + Send>) {
        let info = plugin.get_info();
        let plugin = Arc::new(AsyncMutex::new(plugin));
        self.extensions.push(LoadedExtension::ExtensionInstance {
            plugin,
            info,
            parent_id: parent_id.to_string(),
        });
    }
}

/// Extension wrappers
#[derive(Clone)]
pub enum LoadedExtension {
    // Loaded from the source code itself, not dinamically, e.g git-for-graviton (because it has a manifest but not a path)
    ManifestBuiltin {
        info: ManifestInfo,
    },
    // Loaded from a manifest file dinamically, e.g any third-party extension
    ManifestFile {
        manifest: Manifest,
    },
    // Loaded from a extension
    ExtensionInstance {
        plugin: Arc<AsyncMutex<Box<dyn Extension + Send>>>,
        info: ExtensionInfo,
        parent_id: String,
    },
}
