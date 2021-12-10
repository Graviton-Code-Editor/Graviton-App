use crate::{
    filesystems::{
        DirItemInfo,
        FileInfo,
        FilesystemErrors,
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

pub struct Server {
    states: Arc<Mutex<StatesList>>,
    config: Configuration,
}

impl Server {
    /// Create a new Server
    pub fn new(config: Configuration, states: Arc<Mutex<StatesList>>) -> Self {
        Self { config, states }
    }

    /// Start the JSON RPC HTTP Server and WebSockets server
    pub async fn run(&self) {
        let states = self.states.clone();

        self.config.handler.lock().await.run(states.clone()).await;
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

    /// Update the Core's version of a particular state
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
