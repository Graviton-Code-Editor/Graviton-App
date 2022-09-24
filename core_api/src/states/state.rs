use crate::extensions::base::ExtensionInfo;
use crate::extensions::manager::{ExtensionsManager, LoadedExtension};
use crate::filesystems::{Filesystem, LocalFilesystem};
use crate::language_servers::{LanguageServerBuilder, LanguageServerBuilderInfo};
use crate::messaging::{ClientMessages, ServerMessages};
pub use crate::state_persistors::memory::MemoryPersistor;
use crate::state_persistors::Persistor;
use crate::terminal_shells::{TerminalShell, TerminalShellBuilder, TerminalShellBuilderInfo};
use crate::{Errors, ExtensionErrors, LanguageServer, ManifestInfo};
use std::collections::HashMap;
use std::fmt;
use std::sync::Arc;
use tokio::sync::Mutex;
use tracing::{info, warn};

use super::StateData;

/// A State (similar to a profile) holds persisted data (configuration)
/// but also runtime data such as active Terminals or running Language Servers
#[derive(Clone)]
pub struct State {
    /// Registered FileSystems
    pub filesystems: HashMap<String, Arc<Mutex<Box<dyn Filesystem + Send>>>>,

    /// Manages the extensions from this specific State
    pub extensions_manager: ExtensionsManager,

    /// Handles how the state persisted configuration is saved and loaded
    pub persistor: Option<Arc<Mutex<Box<dyn Persistor + Send>>>>,

    /// Diferent settings changed by the user
    pub data: StateData,

    /// Tokens allowed to use this State
    pub tokens: Vec<String>,

    // Registered Language Servers
    pub language_server_builders:
        HashMap<String, Arc<Mutex<Box<dyn LanguageServerBuilder + Send + Sync>>>>,

    // Active Language Servers
    pub language_servers: HashMap<String, Arc<Mutex<Box<dyn LanguageServer + Send + Sync>>>>,

    // Registered shells
    pub terminal_shell_builders:
        HashMap<String, Arc<Mutex<Box<dyn TerminalShellBuilder + Send + Sync>>>>,

    // Active Shells
    pub terminal_shells: HashMap<String, Arc<Box<dyn TerminalShell + Send + Sync>>>,
}

impl fmt::Debug for State {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("State")
            .field("opened_tabs", &self.data.views)
            .field("commands", &self.data.commands)
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
            language_server_builders: HashMap::new(),
            terminal_shell_builders: HashMap::new(),
            terminal_shells: HashMap::new(),
        }
    }
}

impl State {
    /// Create a new State
    ///
    /// # Arguments
    ///  * `id`                   - The Server's ID
    ///  * `extensions_manager`   - An Extensions Manager for the State
    ///  * `persistor`            - A Persistor from which to load and save the state'sdata
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
    pub async fn run_extensions(&self, state_handle: Arc<Mutex<State>>) {
        for ext in &self.extensions_manager.extensions {
            if let LoadedExtension::ExtensionInstance { plugin, .. } = ext {
                let mut ext_plugin = plugin.lock().await;
                ext_plugin.unload();
                ext_plugin.init(state_handle.clone());
            }
        }
    }

    /// Notify a specific extension about a perticular message
    pub fn notify_extension(&self, extension_id: String, message: ClientMessages) {
        for ext in &self.extensions_manager.extensions {
            if let LoadedExtension::ExtensionInstance {
                plugin, parent_id, ..
            } = ext
            {
                if parent_id == &extension_id {
                    let ext_plugin = plugin.clone();
                    let message = message.clone();
                    tokio::spawn(async move {
                        let mut ext_plugin = ext_plugin.lock().await;
                        ext_plugin.notify(message.clone());
                    });
                }
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
    pub fn get_ext_list(&self) -> Vec<String> {
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

    /// Merge a new state data
    pub async fn update(&mut self, new_data: StateData) {
        let data_has_changed = new_data != self.data;

        if let Some(persistor) = &self.persistor {
            // Only save it if there has been any mutation in the state data
            if data_has_changed {
                persistor.lock().await.save(&new_data);
                self.data = new_data;
            } else {
                info!(
                    "Data from State by id <{}>, hasn't been modified",
                    self.data.id
                );
            }
        } else {
            warn!(
                "Persistor not found for State by id <{}>, could not save",
                self.data.id
            );
        }
    }

    /// Return all the registered language server builders
    pub async fn get_all_language_server_builders(&self) -> Vec<LanguageServerBuilderInfo> {
        let mut list = vec![];
        let language_server_builders = self.language_server_builders.values();

        for language_server_builder in language_server_builders {
            list.push(language_server_builder.lock().await.get_info());
        }

        list
    }

    /// Return all the registered terminal shell builders
    pub async fn get_terminal_shell_builders(&self) -> Vec<TerminalShellBuilderInfo> {
        let mut list = vec![];
        let shell_builders = self.terminal_shell_builders.values();

        for shell_builder in shell_builders {
            list.push(shell_builder.lock().await.get_info());
        }

        list
    }

    /// Create a new terminal shell from a builder ID
    pub async fn create_terminal_shell(
        &mut self,
        terminal_shell_builder_id: String,
        terminal_shell_id: String,
    ) {
        let shell_builder = self.terminal_shell_builders.get(&terminal_shell_builder_id);

        if let Some(shell_builder) = shell_builder {
            let shell_builder = shell_builder.lock().await;
            let shell = shell_builder.build(&terminal_shell_id);
            self.terminal_shells
                .insert(terminal_shell_id.to_string(), Arc::new(shell));
        } else {
            warn!(
                "Could not create a terminal shell, missing builder with id <{}>",
                terminal_shell_builder_id
            );
        }
    }

    /// Write data to a terminal shell
    pub async fn write_to_terminal_shell(&self, terminal_shell_id: String, data: String) {
        let shell = self.terminal_shells.get(&terminal_shell_id);
        if let Some(shell) = shell {
            let shell = shell.clone();
            shell.write(data).await;
        } else {
            warn!(
                "Could not write to non-existent terminal shell, id <{}>",
                terminal_shell_id
            );
        }
    }

    /// Terminate a terminal shell
    pub async fn close_terminal_shell(&mut self, terminal_shell_id: String) {
        self.terminal_shells.remove(&terminal_shell_id);
    }

    /// Resize a terminal shell
    pub async fn resize_terminal_shell(&mut self, terminal_shell_id: String, cols: i32, rows: i32) {
        let shell = self.terminal_shells.get(&terminal_shell_id).unwrap();
        shell.resize(cols, rows).await;
    }

    /// Create a Language Server instance from a Builder ID
    pub async fn create_language_server(&mut self, language_server_builder_id: String) {
        let language_server_builder = self
            .language_server_builders
            .get(&language_server_builder_id);

        if let Some(language_server_builder) = language_server_builder {
            let language_server_builder = language_server_builder.lock().await;
            let info = language_server_builder.get_info();
            let language_server = language_server_builder.build();
            self.language_servers
                .insert(info.id, Arc::new(Mutex::new(language_server)));
        } else {
            warn!(
                "Could not create a language server, missing builder with id <{}>",
                language_server_builder_id
            );
        }
    }

    /// Write to a Language Server instance
    pub async fn write_to_language_server(&mut self, language_server_id: String, data: String) {
        let language_server = self.language_servers.get(&language_server_id);
        if let Some(language_server) = language_server {
            let mut language_server = language_server.lock().await;
            language_server.write(data).await;
        } else {
            warn!(
                "Language Server by id <{}> is not running",
                language_server_id
            );
        }
    }

    /// Terminate to a Language Server instance
    pub async fn unload_language_server(&mut self, language_server_builder_id: &str) {
        self.language_server_builders
            .remove(language_server_builder_id);
        self.language_servers.remove(language_server_builder_id);
        self.extensions_manager
            .sender
            .send(ClientMessages::ServerMessage(
                ServerMessages::UnloadedLanguageServer {
                    id: language_server_builder_id.to_owned(),
                    state_id: self.data.id,
                },
            ))
            .await
            .unwrap();
    }
}

#[cfg(test)]
mod tests {

    use std::sync::Arc;

    use tokio::sync::Mutex;

    use crate::extensions::base::{Extension, ExtensionInfo};
    use crate::extensions::manager::ExtensionsManager;
    use crate::messaging::ClientMessages;
    use crate::states::MemoryPersistor;

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

            fn init(&mut self, _state: Arc<Mutex<State>>) {
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
