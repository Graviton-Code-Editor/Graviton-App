use std::fmt;
use std::path::{
    Path,
    PathBuf,
};
use std::sync::Arc;

use cargo_toml::Value;
use tokio::sync::mpsc::Sender;
use tokio::sync::Mutex as AsyncMutex;

use crate::extensions::base::Extension;
use crate::messaging::Messages;

use super::base::ExtensionInfo;

/// Manage a group of extensions
#[derive(Default, Clone)]
pub struct ExtensionsManager {
    pub extensions: Vec<LoadedExtension>,
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
        path: &Path,
        sender: Sender<Messages>,
        state_id: u8,
    ) -> &mut ExtensionsManager {
        let info = LoadedExtension::get_info_from_file(&path.join("Cargo.toml"));

        if let Some(info) = info {
            self.extensions.push(LoadedExtension::FromFile {
                info,
                path: path.to_path_buf(),
            });
            let extension_file_name = path.file_name().unwrap();

            unsafe {
                // Load the extension library
                // NOTE: The library should be saved instead of leaked. WIP
                let lib = Box::leak(Box::new(
                    libloading::Library::new(path.join(extension_file_name)).unwrap(),
                ));
                // Retrieve the entry function handler
                let entry_func: libloading::Symbol<
                    unsafe extern "C" fn(&ExtensionsManager, Sender<Messages>, u8) -> (),
                > = lib.get(b"entry").unwrap();

                entry_func(self, sender, state_id);
            }
        }

        self
    }

    /// Load a extension
    pub fn register(&mut self, parent_id: &str, plugin: Box<dyn Extension + Send>) {
        let info = plugin.get_info();
        let plugin = Arc::new(AsyncMutex::new(plugin));
        self.extensions.push(LoadedExtension::FromExtension {
            plugin,
            info,
            parent_id: parent_id.to_string(),
        });
    }
}

/// Extension wrappers
#[derive(Clone)]
pub enum LoadedExtension {
    FromFile {
        info: ExtensionInfo,
        path: PathBuf,
    },
    FromExtension {
        plugin: Arc<AsyncMutex<Box<dyn Extension + Send>>>,
        info: ExtensionInfo,
        parent_id: String,
    },
}

impl fmt::Debug for LoadedExtension {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let name = if let LoadedExtension::FromFile { .. } = self {
            "FromFile"
        } else {
            "FromExtension"
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
            Self::FromExtension { info, .. } => info.clone(),
            Self::FromFile { info, .. } => info.clone(),
        }
    }
}
