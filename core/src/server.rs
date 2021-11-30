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
use serde::{
    Deserialize,
    Serialize,
};
use std::sync::{
    Arc,
    Mutex,
};
use tokio::sync::Mutex as AsyncMutex;
use warp::{
    ws::{
        Message,
        WebSocket,
    },
    Filter,
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

#[derive(Deserialize, Serialize)]
struct Options {
    token: String,
    state: u8,
}

/// Middleware that makes sure the incoming websocket connection has a valid token
async fn websockets_authentication(
    states: Arc<Mutex<StatesList>>,
) -> impl Filter<Extract = ((),), Error = warp::reject::Rejection> + Clone {
    warp::query::<Options>()
        .map(move |options| (states.clone(), options))
        .and_then({
            |(states, options): (Arc<Mutex<StatesList>>, Options)| async move {
                if let Some(state) = states.lock().unwrap().get_state_by_id(options.state) {
                    if state.lock().unwrap().has_token(&options.token) {
                        return Ok(());
                    }
                }
                Err(warp::reject::not_found())
            }
        })
}

pub struct Server {
    states: Arc<Mutex<StatesList>>,
    config: Arc<Mutex<Configuration>>,
}

impl Server {
    /// Create a new Server
    pub fn new(config: Arc<Mutex<Configuration>>, states: Arc<Mutex<StatesList>>) -> Self {
        Self { config, states }
    }

    /// Start the JSON RPC HTTP Server and WebSockets server
    pub async fn run(&self) {
        let states = self.states.clone();

        // Create the WebSockets server
        std::thread::spawn(move || {
            let rt = tokio::runtime::Runtime::new().unwrap();
            rt.block_on(async {
                let states = states.clone();

                let routes = warp::path("listen")
                    .and(websockets_authentication(states.clone()).await)
                    .and(warp::ws())
                    .map(move |_, ws: warp::ws::Ws| {
                        let states = states.clone();
                        ws.on_upgrade(async move |websocket| {
                            let (sender, recv) = websocket.split();
                            // Create a different thread of every active connection
                            Self::handle_ws_listener(states.clone(), (sender, recv))
                        })
                    });

                warp::serve(routes).run(([127, 0, 0, 1], 7700)).await;
            });
        });

        // Create the HTTP JSON RPC server
        let mut http_io = IoHandler::default();
        let manager = RpcManager {
            states: self.states.clone(),
        };
        http_io.extend_with(manager.to_delegate());

        let http_cors = self.config.lock().unwrap().json_rpc_http_cors.clone();
        tokio::task::spawn_blocking(move || {
            let server = jsonrpc_http_server::ServerBuilder::new(http_io)
                .cors(http_cors)
                .start_http(&"127.0.0.1:50001".to_string().parse().unwrap())
                .expect("Unable to start RPC HTTP server");
            server.wait();
        })
        .await
        .unwrap();
    }

    /// Handle the socket connection of a listener
    fn handle_ws_listener(
        states: Arc<Mutex<StatesList>>,
        (sender, recv): (SplitSink<WebSocket, Message>, SplitStream<WebSocket>),
    ) {
        let sender = Arc::new(AsyncMutex::new(sender));
        let recv = Arc::new(AsyncMutex::new(recv));

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
                                        let states = states.lock().unwrap();
                                        states.get_state_by_id(state_id)
                                    };
                                    if let Some(state) = state {
                                        // Send the state
                                        sender
                                            .lock()
                                            .await
                                            .send(WebSocketsMessages::state_updated(
                                                state.lock().unwrap().to_owned(),
                                            ))
                                            .await
                                            .unwrap();
                                    }
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
    BadToken,
}

type RPCResult<T> = jsonrpc_core::Result<T>;

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
