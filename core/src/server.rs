use jsonrpc_core::{
    futures::{
        SinkExt,
        StreamExt,
    },
    futures_util::stream::{
        SplitSink,
        SplitStream,
    },
    serde_json,
    serde_json::json,
    IoHandler,
};
use jsonrpc_derive::rpc;
use jsonrpc_http_server::{
    AccessControlAllowOrigin,
    DomainsValidation,
};
use serde::{
    Deserialize,
    Serialize,
};
use std::sync::Arc;
use tokio::sync::Mutex;
use warp::{
    ws::{
        Message,
        WebSocket,
    },
    Filter,
};

use crate::{
    filesystems::FilesystemErrors,
    State,
    StatesList,
};

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "msg_type")]
enum WebSocketsMessages {
    ListenToState {
        // The message author, Core | Client
        trigger: String,
        // The state ID
        state_id: u8,
    },
}

impl WebSocketsMessages {
    /// Short way to create a `stateUpdated` message
    pub fn state_updated(state: State) -> Message {
        Message::text(
            json!({
                "msg_type": "stateUpdated",
                "state": state
            })
            .to_string(),
        )
    }
}

pub struct Server {
    states: Arc<std::sync::Mutex<StatesList>>,
}

impl Server {
    /// Create a new Server
    pub fn new(states: StatesList) -> Self {
        Self {
            states: Arc::new(std::sync::Mutex::new(states)),
        }
    }

    /// Start the JSON RPC HTTP Server and WebSockets server
    pub async fn run(&self) {
        let states = self.states.clone();

        // Create the WebSockets server
        std::thread::spawn(move || {
            let rt = tokio::runtime::Runtime::new().unwrap();
            rt.block_on(async {
                let states = states.clone();

                let routes = warp::path("echo")
                    .and(warp::ws())
                    .map(move |ws: warp::ws::Ws| {
                        let states = states.clone();

                        ws.on_upgrade(async move |websocket| {
                            let (sender, recv) = websocket.split();
                            // Create a different thread of every active connection
                            Self::handle_ws_listener(states.clone(), (sender, recv))
                        })
                    });

                warp::serve(routes).run(([127, 0, 0, 1], 8000)).await;
            });
        });

        // Create the HTTP JSON RPC server
        let mut http_io = IoHandler::default();
        let manager = RpcManager {
            states: self.states.clone(),
        };
        http_io.extend_with(manager.to_delegate());

        tokio::task::spawn_blocking(move || {
            let server = jsonrpc_http_server::ServerBuilder::new(http_io)
                .cors(DomainsValidation::AllowOnly(vec![
                    AccessControlAllowOrigin::Any,
                ]))
                .start_http(&"127.0.0.1:50001".to_string().parse().unwrap())
                .expect("Unable to start RPC HTTP server");
            server.wait();
        })
        .await
        .unwrap();
    }

    /// Handle the socket connection of a listener
    fn handle_ws_listener(
        states: Arc<std::sync::Mutex<StatesList>>,
        (sender, recv): (SplitSink<WebSocket, Message>, SplitStream<WebSocket>),
    ) {
        let sender = Arc::new(Mutex::new(sender));
        let recv = Arc::new(Mutex::new(recv));

        std::thread::spawn(move || {
            let states = states.clone();
            let runtime = tokio::runtime::Runtime::new().unwrap();
            runtime.block_on(async {
                let states = states.clone();
                loop {
                    let mut recv = recv.lock().await;
                    // Listen for incomming messages
                    if let Some(Ok(msg)) = recv.next().await {
                        if msg.is_text() {
                            let text = msg.to_str().unwrap();

                            let message: WebSocketsMessages = serde_json::from_str(text).unwrap();

                            // Handle the incomming message
                            match message {
                                // When a frontend listens for changes in a particular state
                                // The core will sent the current state for it's particular ID if there is anyone
                                // If not, a default state will be sent
                                WebSocketsMessages::ListenToState {
                                    state_id,
                                    trigger: _,
                                } => {
                                    // Make sure if there is already an existing state

                                    let state = {
                                        let mut states = states.lock().unwrap();
                                        if let Some(state) = states.get_state_by_id(state_id) {
                                            state.lock().unwrap().to_owned()
                                        } else {
                                            let state = State::default();
                                            states.add_state(state.clone());
                                            state
                                        }
                                    };

                                    // Send the state
                                    sender
                                        .lock()
                                        .await
                                        .send(WebSocketsMessages::state_updated(state))
                                        .await
                                        .unwrap();

                                    // TODO, this is just spaghetti code to get something basic working
                                }
                            }
                        }
                    }
                }
            });
        });
    }
}

/// Global errors enum
#[derive(Serialize, Deserialize)]
pub enum Errors {
    StateNotFound,
    Fs(FilesystemErrors),
}

type RPCResult<T> = jsonrpc_core::Result<T>;

/// Definition of all JSON RPC Methods
#[rpc]
pub trait RpcMethods {
    #[rpc(name = "get_state_by_id")]
    fn get_state_by_id(&self, state_id: u8) -> RPCResult<Option<State>>;

    #[rpc(name = "set_state_by_id")]
    fn set_state_by_id(&self, state_id: u8, state: State) -> RPCResult<()>;

    #[rpc(name = "read_file_by_path")]
    fn read_file_by_path(
        &self,
        path: String,
        filesystem_name: String,
        state_id: u8,
    ) -> RPCResult<Result<String, Errors>>;

    #[rpc(name = "list_dir_by_path")]
    fn list_dir_by_path(
        &self,
        path: String,
        filesystem_name: String,
        state_id: u8,
    ) -> RPCResult<Result<Vec<String>, Errors>>;
}

/// JSON RPC manager
pub struct RpcManager {
    pub states: Arc<std::sync::Mutex<StatesList>>,
}

/// Implementation of all JSON RPC methods
impl RpcMethods for RpcManager {
    /// Return the state by the given ID if found
    fn get_state_by_id(&self, state_id: u8) -> RPCResult<Option<State>> {
        let states = self.states.lock().unwrap();
        if let Some(state) = states.get_state_by_id(state_id) {
            Ok(Some(state.lock().unwrap().to_owned()))
        } else {
            Ok(None)
        }
    }

    /// Update the Core's version of a particular state
    fn set_state_by_id(&self, _state_id: u8, _state: State) -> RPCResult<()> {
        todo!()
    }

    /// Returns the content of a file
    /// Internally implemented by the given filesystem
    fn read_file_by_path(
        &self,
        path: String,
        filesystem_name: String,
        state_id: u8,
    ) -> RPCResult<Result<String, Errors>> {
        let states = self.states.lock().unwrap();
        // Try to get the requested state
        if let Some(state) = states.get_state_by_id(state_id) {
            // Try to get the requested filesystem implementation
            if let Some(filesystem) = state.lock().unwrap().get_fs_by_name(&filesystem_name) {
                Ok(filesystem.lock().unwrap().read_file_by_path(&path))
            } else {
                Ok(Err(Errors::Fs(FilesystemErrors::FilesystemNotFound)))
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
    ) -> RPCResult<Result<Vec<String>, Errors>> {
        let states = self.states.lock().unwrap();
        // Try to get the requested state
        if let Some(state) = states.get_state_by_id(state_id) {
            // Try to get the requested filesystem implementation
            if let Some(filesystem) = state.lock().unwrap().get_fs_by_name(&filesystem_name) {
                Ok(filesystem.lock().unwrap().list_dir_by_path(&path))
            } else {
                Ok(Err(Errors::Fs(FilesystemErrors::FilesystemNotFound)))
            }
        } else {
            Ok(Err(Errors::StateNotFound))
        }
    }
}
