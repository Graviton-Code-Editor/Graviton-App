use std::fmt;
use std::path::{
    Path,
    PathBuf,
};
use std::sync::Arc;

use cargo_toml::Value;
use tokio::sync::mpsc::{
    channel,
    Sender,
};
use tokio::sync::Mutex as AsyncMutex;

use crate::extensions::base::Extension;
use crate::messaging::Messages;

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
        info: ExtensionInfo,
        state_id: u8,
    ) -> &mut ExtensionsManager {
        let client = ExtensionClient::new(&info.name, self.sender.clone());
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
    // Core invokers might load extensions directly in the source code
    ManifestBuiltin {
        info: ExtensionInfo,
    },
    // Loaded from a manifest file
    ManifestFile {
        info: ExtensionInfo,
        path: PathBuf,
    },
    // Created from a extension
    ExtensionInstance {
        plugin: Arc<AsyncMutex<Box<dyn Extension + Send>>>,
        info: ExtensionInfo,
        parent_id: String,
    },
}

impl fmt::Debug for LoadedExtension {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let name = match self {
            LoadedExtension::ManifestFile { .. } => "FromFile",
            LoadedExtension::ManifestBuiltin { .. } => "FromRuntime",
            LoadedExtension::ExtensionInstance { .. } => "FromExtension",
        };
        f.debug_struct(name)
            .field("info", &self.get_info())
            .finish()
    }
}

impl LoadedExtension {
    /// Retrieve information about a extension from it's manifest file
    pub fn get_info_from_file(manifest_path: &Path) -> Option<ExtensionInfo> {
        let manifest = cargo_toml::Manifest::from_path(manifest_path);

        if manifest.is_err() {
            return None;
        }
        let manifest = manifest.unwrap();
        manifest.package.as_ref()?;

        let package = manifest.package.unwrap();
        package.metadata.as_ref()?;

        let extension_metadata = package.metadata.unwrap();

        if let cargo_toml::Value::Table(extension_metadata) = extension_metadata {
            let graviton_metadata = extension_metadata.get("graviton");
            graviton_metadata.as_ref()?;

            let extension_metadata = graviton_metadata.unwrap();

            if let cargo_toml::Value::Table(info) = extension_metadata {
                let name = package.name;
                let id = info.get("id");

                if let Some(Value::String(id)) = id {
                    return Some(ExtensionInfo {
                        name,
                        id: id.to_string(),
                    });
                }
            }
        }

        None
    }

    /// Retrieve information about the extension
    pub fn get_info(&self) -> ExtensionInfo {
        match self {
            Self::ExtensionInstance { info, .. } => info.clone(),
            Self::ManifestBuiltin { info, .. } => info.clone(),
            Self::ManifestFile { info, .. } => info.clone(),
        }
    }
}
