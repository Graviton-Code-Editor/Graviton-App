use std::path::PathBuf;
use std::sync::Arc;

use tokio::sync::mpsc::{channel, Sender};
use tokio::sync::Mutex;

use crate::extensions::base::Extension;
use crate::messaging::ClientMessages;
use crate::{Manifest, ManifestInfo};

use super::base::ExtensionInfo;
use super::client::ExtensionClient;

/// Manage a group of extensions
#[derive(Clone)]
pub struct ExtensionsManager {
    pub extensions: Vec<LoadedExtension>,
    pub sender: Sender<ClientMessages>,
    pub settings_path: Option<PathBuf>,
}

impl Default for ExtensionsManager {
    fn default() -> Self {
        let (sender, _) = channel::<ClientMessages>(1);
        Self {
            extensions: Vec::new(),
            sender,
            settings_path: None,
        }
    }
}

impl ExtensionsManager {
    pub fn new(sender: Sender<ClientMessages>, settings_path: Option<PathBuf>) -> Self {
        Self {
            extensions: Vec::new(),
            sender,
            settings_path,
        }
    }

    pub async fn load_extension_from_entry(
        &mut self,
        entry: fn(&mut Self, ExtensionClient, u8),
        info: ManifestInfo,
        state_id: u8,
    ) -> &mut ExtensionsManager {
        let client = ExtensionClient::new(
            &info.extension.id,
            &info.extension.name,
            self.sender.clone(),
            self.settings_path.clone(),
        );
        entry(self, client, state_id);
        self.extensions
            .push(LoadedExtension::ManifestBuiltin { info });
        self
    }

    /// Load a extension
    pub fn register(&mut self, parent_id: &str, plugin: Box<dyn Extension + Send>) {
        let info = plugin.get_info();
        let plugin = Arc::new(Mutex::new(plugin));
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
        plugin: Arc<Mutex<Box<dyn Extension + Send>>>,
        info: ExtensionInfo,
        parent_id: String,
    },
}
