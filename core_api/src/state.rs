use crate::extensions::base::ExtensionInfo;
use crate::extensions::manager::{
    ExtensionsManager,
    LoadedExtension,
};
use crate::filesystems::{
    Filesystem,
    LocalFilesystem,
};
use crate::messaging::ExtensionMessages;
use crate::{
    Errors,
    ExtensionErrors,
};
use serde::{
    Deserialize,
    Serialize,
};
use std::collections::HashMap;
use std::fmt;
use std::sync::{
    Arc,
    Mutex,
};

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
            .insert(state.id, Arc::new(Mutex::new(state.to_owned())));

        self
    }

    /// Notify all the extensions in a state about a message
    pub fn notify_extensions(&self, message: ExtensionMessages) {
        let state_id = message.get_state_id();
        let state = self.states.get(&state_id);
        if let Some(state) = state {
            let state = state.lock().unwrap();
            state.notify_extensions(message);
        }
    }
}

/// a Tab state
#[derive(Serialize, Deserialize, Clone, Debug)]
struct Tab {}

/// A state is like a small configuration, like a profile
/// It stores what tabs do you have open, what extensions to load
#[allow(dead_code)]
#[derive(Serialize, Deserialize, Clone)]
pub struct State {
    #[serde(skip_serializing, skip_deserializing)]
    filesystems: HashMap<String, Arc<Mutex<Box<dyn Filesystem + Send>>>>,
    #[serde(skip_serializing, skip_deserializing)]
    extensions_manager: ExtensionsManager,
    opened_tabs: Vec<Tab>,
    pub id: u8,
    tokens: Vec<String>,
}

impl fmt::Debug for State {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("State")
            .field("opened_tabs", &self.opened_tabs)
            .field("id", &self.id)
            .finish()
    }
}

impl Default for State {
    /// The default constructor will include:
    /// - LocalFilesystem
    fn default() -> Self {
        let mut filesystems = HashMap::new();

        // Support the local filesystem by default
        let local_fs: Box<dyn Filesystem + Send> = Box::new(LocalFilesystem::new());
        filesystems.insert("local".to_string(), Arc::new(Mutex::new(local_fs)));

        Self {
            id: 1,
            filesystems,
            extensions_manager: ExtensionsManager::default(),
            opened_tabs: Vec::new(),
            tokens: Vec::new(),
        }
    }
}

impl State {
    pub fn new(id: u8, extensions_manager: ExtensionsManager) -> Self {
        State {
            id,
            extensions_manager,
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
            if let LoadedExtension::FromExtension { plugin, .. } = ext {
                let mut ext_plugin = plugin.lock().await;
                ext_plugin.init();
            }
        }
    }

    /// Notify all the extensions in a state about a message, asynchronously and independently
    pub fn notify_extensions(&self, message: ExtensionMessages) {
        for ext in &self.extensions_manager.extensions {
            if let LoadedExtension::FromExtension { plugin, .. } = ext {
                let ext_plugin = plugin.clone();
                let message = message.clone();
                tokio::task::spawn(async move {
                    let mut ext_plugin = ext_plugin.lock().await;
                    ext_plugin.notify(message.clone());
                });
            }
        }
    }

    /// Try to retrieve info about a perticular loaded extension
    pub fn get_ext_info_by_id(&self, ext_id: &str) -> Result<ExtensionInfo, Errors> {
        let extensions = &self.extensions_manager.extensions;
        let result = extensions
            .iter()
            .find(|extension| {
                if let LoadedExtension::FromFile { info, .. } = extension {
                    info.id == ext_id
                } else {
                    false
                }
            })
            .map(|ext| ext.get_info());

        result.ok_or(Errors::Ext(ExtensionErrors::ExtensionNotFound))
    }

    /// Return the list of loaded extensions
    pub fn get_ext_list_by_id(&self) -> Vec<String> {
        let extensions = &self.extensions_manager.extensions;

        extensions
            .iter()
            .filter_map(|extension| {
                if let LoadedExtension::FromFile { info, .. } = extension {
                    Some(info.id.to_string())
                } else {
                    None
                }
            })
            .collect::<Vec<String>>()
    }
}

// NOTE: It would be interesting to implement https://doc.rust-lang.org/std/ops/trait.AddAssign.html
// So it's easier to merge 2 states, old + new

#[cfg(test)]
mod tests {

    use crate::extensions::base::{
        Extension,
        ExtensionInfo,
    };
    use crate::extensions::manager::ExtensionsManager;
    use crate::messaging::ExtensionMessages;

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

            fn notify(&mut self, _message: ExtensionMessages) {
                todo!()
            }
        }

        Box::new(SampleExtension)
    }

    #[test]
    fn get_info() {
        let mut manager = ExtensionsManager::new();
        manager.register("sample", get_sample_extension());
        let test_state = State::new(0, manager);

        let ext_info = test_state.get_ext_info_by_id("sample");
        assert!(ext_info.is_ok());

        let ext_info = ext_info.unwrap();
        assert_eq!(get_sample_extension_info(), ext_info);
    }
}
