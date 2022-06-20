use crate::handlers::TransportHandler;
use crate::Configuration;
use gveditor_core_api::filesystems::{DirItemInfo, FileInfo, FilesystemErrors};
use gveditor_core_api::messaging::{ClientMessages, ServerMessages};
use gveditor_core_api::state::{StateData, StatesList};
use gveditor_core_api::{Errors, LanguageServer, ManifestInfo, Mutex, State};
use jsonrpc_core::BoxFuture;
use jsonrpc_derive::rpc;

use std::sync::Arc;

pub struct Server {
    states: Arc<Mutex<StatesList>>,
    config: Configuration,
}

/// Graviton Server entry point
///
/// # Example
/// ```rust
/// # use std::sync::Arc;
/// # use gveditor_core::{
///     # handlers::HTTPHandler,
///     # Configuration,
///     # Server,
/// # };
///  # use gveditor_core_api::{
///     # extensions::manager::ExtensionsManager,
///     # messaging::ClientMessages,
///     # state::{
///     #    StatesList,
///     #    TokenFlags,
///     #    MemoryPersistor,
///     # },
///     # State
///  # };
/// # use tokio::sync::{
///    # mpsc::channel,
///    # Mutex
/// # };
///  # tokio_test::block_on(async {
///  let (to_core, from_core) = channel::<ClientMessages>(1);
///
///  // A pointer to a StatesList
///  let states = {
///     // A basic State with ID '1' and no extensions
///     let sample_state = State::new(1, ExtensionsManager::new(to_core.clone(), None), Box::new(MemoryPersistor::new()));
///
///     // A StatesList with the previous state
///     let states = StatesList::new()
///         .with_state(sample_state);
///
///     Arc::new(Mutex::new(states))
///  };
///  
///  // Crate a HTTP TransportHandler and a configuration
///  let http_handler = HTTPHandler::builder().build();
///
///  // Create the configuration
///  let config = Configuration::new(Box::new(http_handler), to_core, from_core);
///
///  // Create a Core
///  let core = Server::new(config, states);
///
///  // Run the core
///  core.run();
///  # })
/// ```
///
impl Server {
    /// Create a new Server
    ///
    /// # Arguments
    ///
    /// * `config`   - The Core configuration
    /// * `states`   - The States list the Core will launch with
    ///
    pub fn new(mut config: Configuration, states: Arc<Mutex<StatesList>>) -> Self {
        let receiver = config.from_core.take();
        let handler = config.handler.clone();
        let states_list = states.clone();

        // Listen messages incoming from the handler
        tokio::spawn(async move {
            if let Some(mut receiver) = receiver {
                loop {
                    if let Some(message) = receiver.recv().await {
                        Self::process_message(states_list.clone(), message, handler.clone()).await;
                    }
                }
            }
        });

        Self { config, states }
    }

    /// Run the configured handler
    pub async fn run(&self) {
        let states = self.states.clone();
        let mut handler = self.config.handler.lock().await;

        handler
            .run(states.clone(), self.config.to_core.clone())
            .await;
    }

    /// Process every message
    pub async fn process_message(
        states: Arc<Mutex<StatesList>>,
        msg: ClientMessages,
        handler: Arc<Mutex<Box<dyn TransportHandler + Send + Sync>>>,
    ) {
        match msg.clone() {
            ClientMessages::ListenToState { state_id } => {
                // Make sure if there is already an existing state
                let state = {
                    let states = states.lock().await;
                    states.get_state_by_id(state_id)
                };

                if let Some(state) = state {
                    let handler = handler.lock().await;
                    // Send the loaded state to the handler
                    let message = ServerMessages::StateUpdated {
                        state_data: state.lock().await.data.clone(),
                    };
                    handler.send(message).await;

                    state.lock().await.run_extensions().await;
                }
            }
            ClientMessages::NotifyLanguageServers(message) => {
                let state_id = message.get_state_id();

                let state = {
                    let states = states.lock().await;
                    states.get_state_by_id(state_id)
                };

                if let Some(state) = state {
                    state
                        .lock()
                        .await
                        .notify_extensions(ClientMessages::NotifyLanguageServers(message));
                }
            }
            ClientMessages::UIEvent(event) => {
                let state_id = event.get_state_id();

                let state = {
                    let states = states.lock().await;
                    states.get_state_by_id(state_id)
                };

                if let Some(state) = state {
                    state.lock().await.notify_extensions(msg);
                }
            }
            ClientMessages::NotifyExtension(event) => {
                let state_id = event.get_state_id();
                let extension_id = event.get_extension_id();

                let state = {
                    let states = states.lock().await;
                    states.get_state_by_id(state_id)
                };

                if let Some(state) = state {
                    let state = state.lock().await;

                    state.notify_extension(extension_id, msg);
                }
            }
            ClientMessages::ServerMessage(server_msg) => {
                match server_msg {
                    ServerMessages::RegisterLanguageServers {
                        state_id,
                        languages,
                        ..
                    } => {
                        let state = {
                            let states = states.lock().await;
                            states.get_state_by_id(state_id)
                        };

                        if let Some(state) = state {
                            state
                                .lock()
                                .await
                                .register_language_servers(languages)
                                .await;
                        }
                    }
                    ServerMessages::StateUpdated { .. } => {
                        let states = states.lock().await;
                        states.notify_extensions(msg).await;
                    }
                    _ => {
                        // Forward to the handler messages not handled here
                        let handler = handler.lock().await;
                        handler.send(server_msg).await;
                    }
                }
            }
            _ => {}
        }
    }
}

pub type RPCResult<T> = jsonrpc_core::Result<T>;

/// Definition of all JSON RPC Methods
#[rpc]
pub trait RpcMethods {
    #[rpc(name = "get_state_data_by_id")]
    fn get_state_by_id(
        &self,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Option<StateData>, Errors>>>;

    #[rpc(name = "set_state_data_by_id")]
    fn set_state_by_id(
        &self,
        state_id: u8,
        state: StateData,
        token: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>>;

    #[rpc(name = "read_file_by_path")]
    fn read_file_by_path(
        &self,
        path: String,
        filesystem_name: String,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<FileInfo, Errors>>>;

    #[rpc(name = "write_file_by_path")]
    fn write_file_by_path(
        &self,
        path: String,
        content: String,
        filesystem_name: String,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>>;

    #[rpc(name = "list_dir_by_path")]
    fn list_dir_by_path(
        &self,
        path: String,
        filesystem_name: String,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Vec<DirItemInfo>, Errors>>>;

    #[rpc(name = "get_ext_info_by_id")]
    fn get_ext_info_by_id(
        &self,
        extension_id: String,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<ManifestInfo, Errors>>>;

    #[rpc(name = "get_ext_list_by_id")]
    fn get_ext_list_by_id(
        &self,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Vec<String>, Errors>>>;

    #[rpc(name = "get_all_language_servers")]
    fn get_all_language_servers(
        &self,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Vec<LanguageServer>, Errors>>>;

    #[rpc(name = "get_all_language_servers")]
    fn notify_extension(
        &self,
        state_id: u8,
        token: String,
        message: ClientMessages,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>>;
}

async fn verify_state(
    states: Arc<Mutex<StatesList>>,
    state_id: u8,
    token: String,
) -> Result<Arc<Mutex<State>>, Errors> {
    let states = states.lock().await;
    // Try to get the requested state
    if let Some(state) = states.get_state_by_id(state_id) {
        let state_g = state.lock().await;
        // Make sure the token is valid
        if state_g.has_token(&token) {
            drop(state_g);
            Ok(state)
        } else {
            Err(Errors::BadToken)
        }
    } else {
        Err(Errors::StateNotFound)
    }
}

/// JSON RPC manager
pub struct RpcManager {
    pub states: Arc<Mutex<StatesList>>,
}

/// Implementation of all JSON RPC methods
impl RpcMethods for RpcManager {
    /// Return the state by the given ID if found
    fn get_state_by_id(
        &self,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Option<StateData>, Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;
                if let Ok(state) = state {
                    let state = state.lock().await;
                    Ok(Some(state.data.clone()))
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    /// Update an state
    fn set_state_by_id(
        &self,
        state_id: u8,
        new_state_data: StateData,
        token: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let mut state = state.lock().await;

                    tracing::info!("Updated state by id <{}>", state.data.id);
                    state.update(new_state_data).await;

                    Ok(())
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    /// Returns the content of a file
    /// Internally implemented by the given filesystem
    fn read_file_by_path(
        &self,
        path: String,
        filesystem_name: String,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<FileInfo, Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let state = state.lock().await;

                    if let Some(filesystem) = state.get_fs_by_name(&filesystem_name) {
                        let filesystem = filesystem.lock().await;
                        let result = filesystem.read_file_by_path(&path);
                        let result = result.await;

                        state.notify_extensions(ClientMessages::ReadFile(
                            state_id,
                            filesystem_name,
                            result.clone(),
                        ));

                        result
                    } else {
                        Err(Errors::Fs(FilesystemErrors::FilesystemNotFound))
                    }
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    /// Writes new content to the specified path
    fn write_file_by_path(
        &self,
        path: String,
        content: String,
        filesystem_name: String,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>> {
        let states = self.states.clone();

        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let state = state.lock().await;

                    if let Some(filesystem) = state.get_fs_by_name(&filesystem_name) {
                        let filesystem = filesystem.lock().await;
                        let result = filesystem.write_file_by_path(&path, &content);
                        let result = result.await;

                        state.notify_extensions(ClientMessages::WriteFile(
                            state_id,
                            filesystem_name,
                            content,
                            result.clone(),
                        ));

                        result
                    } else {
                        Err(Errors::Fs(FilesystemErrors::FilesystemNotFound))
                    }
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    /// Returns the list of items inside the given directory
    /// Internally implemented by the given filesystem
    fn list_dir_by_path(
        &self,
        path: String,
        filesystem_name: String,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Vec<DirItemInfo>, Errors>>> {
        let states = self.states.clone();

        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let state = state.lock().await;

                    if let Some(filesystem) = state.get_fs_by_name(&filesystem_name) {
                        let filesystem = filesystem.lock().await;
                        let result = filesystem.list_dir_by_path(&path);
                        let result = result.await;

                        state.notify_extensions(ClientMessages::ListDir(
                            state_id,
                            filesystem_name,
                            path,
                            result.clone(),
                        ));

                        result
                    } else {
                        Err(Errors::Fs(FilesystemErrors::FilesystemNotFound))
                    }
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    /// Returns the information about a extension
    fn get_ext_info_by_id(
        &self,
        extension_id: String,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<ManifestInfo, Errors>>> {
        let states = self.states.clone();

        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let state = state.lock().await;

                    state.get_ext_info_by_id(&extension_id)
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }
    /// Returns the list of extensions in the specified state
    fn get_ext_list_by_id(
        &self,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Vec<String>, Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let state = state.lock().await;

                    Ok(state.get_ext_list_by_id())
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    /// Returns the list of language servers services in the specified state
    fn get_all_language_servers(
        &self,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Vec<LanguageServer>, Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let state = state.lock().await;

                    Ok(state.get_all_language_servers().await)
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    fn notify_extension(
        &self,
        state_id: u8,
        token: String,
        message: ClientMessages,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let state = state.lock().await;

                    state.notify_extensions(message);

                    Ok(())
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }
}
