use crate::extensions::base::ExtensionInfo;
use crate::extensions::manager::{ExtensionsManager, LoadedExtension};
use crate::filesystems::{FileFormat, Filesystem, LocalFilesystem};
use crate::messaging::ClientMessages;
pub use crate::state_persistors::memory::MemoryPersistor;
use crate::state_persistors::Persistor;
use crate::{Errors, ExtensionErrors, LanguageServer, ManifestInfo};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fmt;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone)]
pub enum TokenFlags {
    All(String),
}

/// Internal list of states
#[derive(Clone, Default)]
pub struct StatesList {
    states: HashMap<u8, Arc<Mutex<State>>>,
    provided_tokens: Vec<TokenFlags>,
}

impl StatesList {
    /// Create a new empty states list
    pub fn new() -> Self {
        Self {
            states: HashMap::new(),
            provided_tokens: Vec::new(),
        }
    }

    pub fn with_tokens(mut self, tokens: &[TokenFlags]) -> Self {
        self.provided_tokens = tokens.to_vec();
        self
    }

    /// Return the state by the given ID if found
    pub fn get_state_by_id(&self, id: u8) -> Option<Arc<Mutex<State>>> {
        self.states.get(&id).cloned()
    }

    /// Return the state by the given ID if found
    pub fn with_state(mut self, state: State) -> Self {
        let mut state = state;

        for token in &self.provided_tokens {
            match token {
                TokenFlags::All(token) => {
                    state.tokens.push(token.clone());
                }
            }
        }

        self.states
            .insert(state.data.id, Arc::new(Mutex::new(state.to_owned())));

        self
    }

    /// Notify all the extensions in a state about a message
    pub async fn notify_extensions(&self, message: ClientMessages) {
        let state_id = message.get_state_id();
        let state = self.states.get(&state_id);
        if let Some(state) = state {
            let state = state.lock().await;
            state.notify_extensions(message);
        }
    }
}

/// A Tab data
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(tag = "tab_type")]
pub enum TabData {
    // Text Editor tab
    TextEditor {
        path: String,
        filesystem: String,
        format: FileFormat,
        filename: String,
        id: String,
    },
    // Basic tab (e.g. Settings)
    Basic {
        title: String,
        id: String,
    },
}
#[derive(Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
struct ViewPanel {
    selected_tab_id: Option<String>,
    tabs: Vec<TabData>,
}

type TabsViews = Vec<ViewPanel>;

/// The data of a state
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct StateData {
    pub id: u8,
    opened_tabs: Vec<TabsViews>,
}

impl Default for StateData {
    fn default() -> Self {
        Self {
            id: 1,
            opened_tabs: Vec::default(),
        }
    }
}

/// A state is like a small configuration, like a profile
#[derive(Clone)]
pub struct State {
    filesystems: HashMap<String, Arc<Mutex<Box<dyn Filesystem + Send>>>>,
    extensions_manager: ExtensionsManager,
    persistor: Option<Arc<Mutex<Box<dyn Persistor + Send>>>>,
    pub data: StateData,
    tokens: Vec<String>,
    language_servers: HashMap<String, LanguageServer>,
}

impl fmt::Debug for State {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("State")
            .field("opened_tabs", &self.data.opened_tabs)
            .field("id", &self.data.id)
            .finish()
    }
}

impl Default for State {
    /// The default constructor will include:
    /// - LocalFilesystem
    ///
    /// But will not persist the state
    fn default() -> Self {
        let mut filesystems = HashMap::new();

        // Support the local filesystem by default
        let local_fs: Box<dyn Filesystem + Send> = Box::new(LocalFilesystem::new());
        filesystems.insert("local".to_string(), Arc::new(Mutex::new(local_fs)));

        Self {
            data: StateData::default(),
            filesystems,
            extensions_manager: ExtensionsManager::default(),
            tokens: Vec::new(),
            persistor: None,
            language_servers: HashMap::new(),
        }
    }
}

impl State {
    pub fn new(
        id: u8,
        extensions_manager: ExtensionsManager,
        mut persistor: Box<dyn Persistor + Send>,
    ) -> Self {
        // Retrieve opened tabs from the persistor
        let state = persistor.load();

        State {
            data: StateData { id, ..state },
            extensions_manager,
            persistor: Some(Arc::new(Mutex::new(persistor))),
            ..Default::default()
        }
    }

    /// Retrieve the specified filesystem by the given name
    pub fn get_fs_by_name(
        &self,
        filesystem: &str,
    ) -> Option<Arc<Mutex<Box<dyn Filesystem + Send>>>> {
        return self.filesystems.get(filesystem).cloned();
    }

    // Check if the state can be used with the specified token
    pub fn has_token(&self, token: &str) -> bool {
        self.tokens.contains(&token.to_owned())
    }

    /// Run all the extensions in the manager
    pub async fn run_extensions(&self) {
        for ext in &self.extensions_manager.extensions {
            if let LoadedExtension::ExtensionInstance { plugin, .. } = ext {
                let mut ext_plugin = plugin.lock().await;
                ext_plugin.unload();
                ext_plugin.init();
            }
        }
    }

    /// Notify all the extensions in a state about a message, asynchronously and independently
    pub fn notify_extensions(&self, message: ClientMessages) {
        for ext in &self.extensions_manager.extensions {
            if let LoadedExtension::ExtensionInstance { plugin, .. } = ext {
                let ext_plugin = plugin.clone();
                let message = message.clone();
                tokio::spawn(async move {
                    let mut ext_plugin = ext_plugin.lock().await;
                    ext_plugin.notify(message.clone());
                });
            }
        }
    }

    /// Try to retrieve info about a perticular loaded extension
    pub fn get_ext_info_by_id(&self, ext_id: &str) -> Result<ManifestInfo, Errors> {
        let extensions = &self.extensions_manager.extensions;
        let result = extensions.iter().find_map(|extension| {
            if let LoadedExtension::ManifestFile { manifest } = extension {
                if manifest.info.extension.id == ext_id {
                    Some(manifest.info.clone())
                } else {
                    None
                }
            } else if let LoadedExtension::ManifestBuiltin { info, .. } = extension {
                if info.extension.id == ext_id {
                    Some(info.clone())
                } else {
                    None
                }
            } else {
                None
            }
        });

        result.ok_or(Errors::Ext(ExtensionErrors::ExtensionNotFound))
    }

    /// Try to retrieve info about a perticular loaded extension
    pub fn get_ext_run_info_by_id(&self, ext_id: &str) -> Result<ExtensionInfo, Errors> {
        let extensions = &self.extensions_manager.extensions;
        let result = extensions.iter().find_map(|extension| {
            if let LoadedExtension::ExtensionInstance { info, .. } = extension {
                if info.id == ext_id {
                    Some(info.clone())
                } else {
                    None
                }
            } else {
                None
            }
        });

        result.ok_or(Errors::Ext(ExtensionErrors::ExtensionNotFound))
    }

    /// Return the list of loaded extensions
    pub fn get_ext_list_by_id(&self) -> Vec<String> {
        let extensions = &self.extensions_manager.extensions;

        extensions
            .iter()
            .filter_map(|extension| {
                if let LoadedExtension::ManifestBuiltin { info, .. } = extension {
                    Some(info.extension.id.to_string())
                } else if let LoadedExtension::ManifestFile { manifest } = extension {
                    Some(manifest.info.extension.id.to_string())
                } else {
                    None
                }
            })
            .collect::<Vec<String>>()
    }

    // Merge a new state data
    pub async fn update(&mut self, new_data: StateData) {
        self.data.opened_tabs = new_data.opened_tabs;

        if let Some(persistor) = &self.persistor {
            persistor.lock().await.save(&self.data);
        }
    }

    // Register a new language server
    pub async fn register_language_servers(
        &mut self,
        language_servers: HashMap<String, LanguageServer>,
    ) {
        self.language_servers.extend(language_servers);
    }

    // Register a new language server
    pub async fn get_all_language_servers(&self) -> Vec<LanguageServer> {
        self.language_servers
            .values()
            .cloned()
            .collect::<Vec<LanguageServer>>()
    }
}

// NOTE: It would be interesting to implement https://doc.rust-lang.org/std/ops/trait.AddAssign.html
// So it's easier to merge 2 states, old + new

#[cfg(test)]
mod tests {

    use crate::extensions::base::{Extension, ExtensionInfo};
    use crate::extensions::manager::ExtensionsManager;
    use crate::messaging::ClientMessages;
    use crate::state::MemoryPersistor;

    use super::State;

    fn get_sample_extension_info() -> ExtensionInfo {
        ExtensionInfo {
            id: "sample".to_string(),
            name: "sample".to_string(),
        }
    }

    fn get_sample_extension() -> Box<dyn Extension + Send> {
        struct SampleExtension;

        impl Extension for SampleExtension {
            fn get_info(&self) -> ExtensionInfo {
                get_sample_extension_info()
            }

            fn init(&mut self) {
                todo!()
            }

            fn unload(&mut self) {
                todo!()
            }

            fn notify(&mut self, _message: ClientMessages) {
                todo!()
            }
        }

        Box::new(SampleExtension)
    }

    #[test]
    fn get_info() {
        let mut manager = ExtensionsManager::default();
        manager.register("sample", get_sample_extension());
        let test_state = State::new(0, manager, Box::new(MemoryPersistor::new()));

        let ext_info = test_state.get_ext_run_info_by_id("sample");
        assert!(ext_info.is_ok());

        let ext_info = ext_info.unwrap();
        assert_eq!(get_sample_extension_info(), ext_info);
    }
}
