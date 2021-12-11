use crate::{
    configuration::Handler,
    filesystems::{
        DirItemInfo,
        FileInfo,
        FilesystemErrors,
    },
    handlers::{
        Messages,
        TransportHandler,
    },
    Configuration,
    State,
    StatesList,
};
use jsonrpc_derive::rpc;
use serde::{
    Deserialize,
    Serialize,
};
use std::sync::{
    Arc,
    Mutex,
};
use tokio::sync::{
    mpsc::{
        channel,
        Receiver,
        Sender,
    },
    Mutex as AsyncMutex,
};

pub struct Server {
    states: Arc<Mutex<StatesList>>,
    config: Configuration,
    sender: Arc<Mutex<Sender<Messages>>>,
}

impl Server {
    /// Create a new Server
    pub fn new(config: Configuration, states: Arc<Mutex<StatesList>>) -> Self {
        let (sender, receiver) = channel::<Messages>(1);
        let sender = Arc::new(Mutex::new(sender));

        Self::create_receiver(states.clone(), receiver, config.handler.clone());

        Self {
            config,
            states,
            sender,
        }
    }

    /// Receive all incoming messages
    pub fn create_receiver(
        states: Arc<Mutex<StatesList>>,
        mut receiver: Receiver<Messages>,
        handler: Handler,
    ) {
        std::thread::spawn(move || {
            let rt = tokio::runtime::Runtime::new().unwrap();
            rt.block_on(async move {
                loop {
                    if let Some(message) = receiver.recv().await {
                        Self::process_message(states.clone(), message, handler.clone()).await;
                    }
                }
            });
        });
    }

    /// Run the configured handler
    pub async fn run(&self) {
        let states = self.states.clone();
        let mut handler = self.config.handler.lock().await;

        handler.run(states.clone(), self.sender.clone()).await;
    }

    /// Process every message
    pub async fn process_message(
        states: Arc<Mutex<StatesList>>,
        msg: Messages,
        handler: Arc<AsyncMutex<Box<dyn TransportHandler + Send + Sync>>>,
    ) {
        match msg {
            Messages::ListenToState {
                state_id,
                trigger: _,
            } => {
                // Make sure if there is already an existing state
                let state = {
                    let states = states.lock().unwrap();
                    states.get_state_by_id(state_id)
                };
                if let Some(state) = state {
                    let handler = handler.lock().await;
                    // Send the loaded state to the handler
                    let message = Messages::StateUpdated {
                        state: state.lock().unwrap().to_owned(),
                    };
                    handler.send(message).await;
                }
            }
            Messages::StateUpdated { .. } => {}
        }
    }
}

/// Global errors enum
#[derive(Serialize, Deserialize, Debug)]
pub enum Errors {
    StateNotFound,
    Fs(FilesystemErrors),
    BadToken,
}

pub type RPCResult<T> = jsonrpc_core::Result<T>;

/// Definition of all JSON RPC Methods
#[rpc]
pub trait RpcMethods {
    #[rpc(name = "get_state_by_id")]
    fn get_state_by_id(&self, state_id: u8, token: String) -> RPCResult<Option<State>>;

    #[rpc(name = "set_state_by_id")]
    fn set_state_by_id(&self, state_id: u8, state: State, token: String) -> RPCResult<()>;

    #[rpc(name = "read_file_by_path")]
    fn read_file_by_path(
        &self,
        path: String,
        filesystem_name: String,
        state_id: u8,
        token: String,
    ) -> RPCResult<Result<FileInfo, Errors>>;

    #[rpc(name = "list_dir_by_path")]
    fn list_dir_by_path(
        &self,
        path: String,
        filesystem_name: String,
        state_id: u8,
        token: String,
    ) -> RPCResult<Result<Vec<DirItemInfo>, Errors>>;
}

/// JSON RPC manager
pub struct RpcManager {
    pub states: Arc<Mutex<StatesList>>,
}

/// Implementation of all JSON RPC methods
impl RpcMethods for RpcManager {
    /// Return the state by the given ID if found
    fn get_state_by_id(&self, state_id: u8, token: String) -> RPCResult<Option<State>> {
        let states = self.states.lock().unwrap();
        // Try to get the requested state
        if let Some(state) = states.get_state_by_id(state_id) {
            // Make sure the token is valid
            if state.lock().unwrap().has_token(&token) {
                Ok(Some(state.lock().unwrap().to_owned()))
            } else {
                Ok(None)
            }
        } else {
            Ok(None)
        }
    }

    /// Update an state
    fn set_state_by_id(&self, _state_id: u8, _state: State, _token: String) -> RPCResult<()> {
        todo!()
    }

    /// Returns the content of a file
    /// Internally implemented by the given filesystem
    fn read_file_by_path(
        &self,
        path: String,
        filesystem_name: String,
        state_id: u8,
        token: String,
    ) -> RPCResult<Result<FileInfo, Errors>> {
        let states = self.states.lock().unwrap();
        // Try to get the requested state
        if let Some(state) = states.get_state_by_id(state_id) {
            // Make sure the token is valid
            if state.lock().unwrap().has_token(&token) {
                // Try to get the requested filesystem implementation
                if let Some(filesystem) = state.lock().unwrap().get_fs_by_name(&filesystem_name) {
                    Ok(filesystem.lock().unwrap().read_file_by_path(&path))
                } else {
                    Ok(Err(Errors::Fs(FilesystemErrors::FilesystemNotFound)))
                }
            } else {
                Ok(Err(Errors::BadToken))
            }
        } else {
            Ok(Err(Errors::StateNotFound))
        }
    }

    /// Returns the list of items inside the given directory
    /// Internally implemented by the given filesystem
    fn list_dir_by_path(
        &self,
        path: String,
        filesystem_name: String,
        state_id: u8,
        token: String,
    ) -> RPCResult<Result<Vec<DirItemInfo>, Errors>> {
        let states = self.states.lock().unwrap();
        // Try to get the requested state
        if let Some(state) = states.get_state_by_id(state_id) {
            // Make sure the token is valid
            if state.lock().unwrap().has_token(&token) {
                // Try to get the requested filesystem implementation
                if let Some(filesystem) = state.lock().unwrap().get_fs_by_name(&filesystem_name) {
                    Ok(filesystem.lock().unwrap().list_dir_by_path(&path))
                } else {
                    Ok(Err(Errors::Fs(FilesystemErrors::FilesystemNotFound)))
                }
            } else {
                Ok(Err(Errors::BadToken))
            }
        } else {
            Ok(Err(Errors::StateNotFound))
        }
    }
}
