use crate::handlers::TransportHandler;
use crate::Configuration;
use gveditor_core_api::filesystems::{DirItemInfo, FileInfo, FilesystemErrors};
use gveditor_core_api::language_servers::LanguageServerBuilderInfo;
use gveditor_core_api::messaging::{ClientMessages, ServerMessages};
use gveditor_core_api::states::{StateData, StatesList};
use gveditor_core_api::terminal_shells::TerminalShellBuilderInfo;
use gveditor_core_api::{Errors, ManifestInfo, Mutex, State};
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
///  let (to_server, from_server) = channel::<ClientMessages>(1);
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
///  let config = Configuration::new(Box::new(http_handler), to_server, from_server);
///
///  // Create a server
///  let server = Server::new(config, states);
///
///  // Run the Server
///  server.run();
///  # })
/// ```
///
impl Server {
    /// Create a new Server
    ///
    /// # Arguments
    ///
    /// * `config`   - The Server configuration
    /// * `states`   - The States list the Server will launch with
    ///
    pub fn new(mut config: Configuration, states: Arc<Mutex<StatesList>>) -> Self {
        let receiver = config.from_server.take();
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

    /// Run the configuyred handler
    pub async fn run(&self) {
        let states = self.states.clone();
        let mut handler = self.config.handler.lock().await;

        handler
            .run(states.clone(), self.config.to_server.clone())
            .await;
    }

    /// Process every message
    ///
    /// # Arguments
    ///
    /// * `states`   - The States list the Server will launch with
    /// * `message`  - The message to process
    /// * `handler`  - The transport handler
    ///
    pub async fn process_message(
        states: Arc<Mutex<StatesList>>,
        message: ClientMessages,
        handler: Arc<Mutex<Box<dyn TransportHandler + Send + Sync>>>,
    ) {
        match message.clone() {
            ClientMessages::ListenToState { state_id } => {
                let state = {
                    let states = states.lock().await;
                    states.get_state_by_id(state_id)
                };

                if let Some(state) = state {
                    {
                        // Send the loaded state to the handler
                        let handler = handler.lock().await;
                        let message = ServerMessages::StateUpdated {
                            state_data: state.lock().await.data.clone(),
                        };
                        handler.send(message).await;
                    }

                    // Execute the registered extensions in the State
                    let state_handle = state.clone();
                    state.lock().await.run_extensions(state_handle).await;
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
                    state.lock().await.notify_extensions(message);
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

                    state.notify_extension(extension_id, message);
                }
            }
            ClientMessages::ServerMessage(server_msg) => {
                match server_msg {
                    ServerMessages::StateUpdated { .. } => {
                        let states = states.lock().await;
                        states.notify_extensions(message).await;
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
    #[rpc(name = "get_state_by_id")]
    fn get_state_by_id(
        &self,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Option<StateData>, Errors>>>;

    #[rpc(name = "set_state_by_id")]
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

    #[rpc(name = "get_ext_list")]
    fn get_ext_list(
        &self,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Vec<String>, Errors>>>;

    #[rpc(name = "get_all_language_server_builders")]
    fn get_all_language_server_builders(
        &self,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Vec<LanguageServerBuilderInfo>, Errors>>>;

    #[rpc(name = "notify_extension")]
    fn notify_extension(
        &self,
        state_id: u8,
        token: String,
        message: ClientMessages,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>>;

    #[rpc(name = "write_to_terminal_shell")]
    fn write_to_terminal_shell(
        &self,
        state_id: u8,
        token: String,
        terminal_shell_id: String,
        data: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>>;

    #[rpc(name = "close_terminal_shell")]
    fn close_terminal_shell(
        &self,
        state_id: u8,
        token: String,
        terminal_shell_id: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>>;

    #[rpc(name = "create_terminal_shell")]
    fn create_terminal_shell(
        &self,
        state_id: u8,
        token: String,
        terminal_shell_builder_id: String,
        terminal_shell_id: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>>;

    #[rpc(name = "get_terminal_shell_builders")]
    fn get_terminal_shell_builders(
        &self,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Vec<TerminalShellBuilderInfo>, Errors>>>;

    #[rpc(name = "resize_terminal_shell")]
    fn resize_terminal_shell(
        &self,
        state_id: u8,
        token: String,
        terminal_shell_id: String,
        cols: u16,
        rows: u16,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>>;

    #[rpc(name = "create_language_server")]
    fn create_language_server(
        &self,
        state_id: u8,
        token: String,
        language_server_builder_id: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>>;

    #[rpc(name = "write_to_language_server")]
    fn write_to_language_server(
        &self,
        state_id: u8,
        token: String,
        language_server_builder_id: String,
        data: String,
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
    fn get_ext_list(
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

                    Ok(state.get_ext_list())
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    /// Returns the list of language servers builders registered in the specified state
    fn get_all_language_server_builders(
        &self,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Vec<LanguageServerBuilderInfo>, Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let state = state.lock().await;

                    Ok(state.get_all_language_server_builders().await)
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

    fn write_to_terminal_shell(
        &self,
        state_id: u8,
        token: String,
        terminal_shell_id: String,
        data: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let state = state.lock().await;

                    state.write_to_terminal_shell(terminal_shell_id, data).await;

                    Ok(())
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    fn create_terminal_shell(
        &self,
        state_id: u8,
        token: String,
        terminal_shell_builder_id: String,
        terminal_shell_id: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let mut state = state.lock().await;

                    state
                        .create_terminal_shell(terminal_shell_builder_id, terminal_shell_id)
                        .await;

                    Ok(())
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    fn close_terminal_shell(
        &self,
        state_id: u8,
        token: String,
        terminal_shell_id: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let mut state = state.lock().await;

                    state.close_terminal_shell(terminal_shell_id).await;

                    Ok(())
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    fn get_terminal_shell_builders(
        &self,
        state_id: u8,
        token: String,
    ) -> BoxFuture<RPCResult<Result<Vec<TerminalShellBuilderInfo>, Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let state = state.lock().await;

                    Ok(state.get_terminal_shell_builders().await)
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    fn resize_terminal_shell(
        &self,
        state_id: u8,
        token: String,
        terminal_shell_id: String,
        cols: u16,
        rows: u16,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let mut state = state.lock().await;

                    state
                        .resize_terminal_shell(terminal_shell_id, cols, rows)
                        .await;

                    Ok(())
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    fn create_language_server(
        &self,
        state_id: u8,
        token: String,
        language_server_builder_id: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let mut state = state.lock().await;

                    state
                        .create_language_server(language_server_builder_id)
                        .await;

                    Ok(())
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }

    fn write_to_language_server(
        &self,
        state_id: u8,
        token: String,
        language_server_id: String,
        data: String,
    ) -> BoxFuture<RPCResult<Result<(), Errors>>> {
        let states = self.states.clone();
        Box::pin(async move {
            Ok({
                let state = verify_state(states, state_id, token).await;

                if let Ok(state) = state {
                    let mut state = state.lock().await;

                    state
                        .write_to_language_server(language_server_id, data)
                        .await;

                    Ok(())
                } else {
                    Err(state.unwrap_err())
                }
            })
        })
    }
}
