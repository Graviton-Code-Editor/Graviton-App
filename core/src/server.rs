use jsonrpc_core::futures::SinkExt;
use jsonrpc_core::futures::StreamExt;
use jsonrpc_core::serde_json;
use jsonrpc_core::serde_json::json;
use jsonrpc_core::IoHandler;
use jsonrpc_derive::rpc;
use jsonrpc_http_server::AccessControlAllowOrigin;
use jsonrpc_http_server::DomainsValidation;
use serde::Deserialize;
use serde::Serialize;
use std::sync::Arc;
use warp::{ws::Message, Filter};

use crate::State;
use crate::StatesList;

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "msg_type")]
enum WebSocketsMessages {
    ListenToState { 
        // The message author, Core | Client
        trigger: String,
        // The state ID
        state_id: u8
     },
}

pub struct Server {
    states: StatesList,
}

impl Server {
    pub fn new(states: StatesList) -> Self {
        Self {
            states: states.clone(),
        }
    }

    /// Start the JSON RPC HTTP Server and WebSockets server
    ///
    /// List of possible JSON RPC methods:
    /// - get_file_content(path: &str, filesystem: FsEnum)
    /// - get_file_info(path: &str filesystem: FsEnum)
    /// - get_state_by_id(id: u8) -> State
    /// - set_state_by_id(id: u8, state: State)
    pub async fn run(&self) {
        let states = self.states.clone();

        // Create the WebSockets server
        tokio::task::spawn_blocking(async move || {
            let states = states.clone();

            let routes = warp::path("echo")
                .and(warp::ws())
                .map(move |ws: warp::ws::Ws| {
                    let states = states.clone();

                    ws.on_upgrade(async move |websocket| {
                        let (sender, recv) = websocket.split();

                        use tokio::sync::Mutex;

                        let sender = Arc::new(Mutex::new(sender));
                        let recv = Arc::new(Mutex::new(recv));

                        // Create a different thread of every active connection
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

                                            let message: WebSocketsMessages =
                                                serde_json::from_str(text).unwrap();

                                            // Handle the incomming message
                                            match message {
                                                // When a frontend listens for changes in a particular state
                                                // The core will sent the current state for it's particular ID if there is anyone
                                                // If not, a default state will be sent
                                                WebSocketsMessages::ListenToState {
                                                    state_id,
                                                    trigger,
                                                } => {
                                                    // Make sure if there is already an existing state 
                                                    let state = if let Some(state) = states.get_state_by_id(state_id) {
                                                        state.lock().unwrap().to_owned()
                                                    } else {
                                                        State::default()
                                                    };

                                                    // Send the state
                                                    sender
                                                        .lock()
                                                        .await
                                                        .send(Message::text(
                                                            json!({
                                                                "msg_type": "stateUpdated",
                                                                "state": state
                                                            })
                                                            .to_string(),
                                                        ))
                                                        .await
                                                        .unwrap();

                                                    // TODO, this is just spaghetti code to get something basic working
                                                }
                                                _ => {
                                                    println!("unknown message")
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    })
                });

            warp::serve(routes).run(([127, 0, 0, 1], 8000)).await;
        })
        .await
        .unwrap()
        .await;

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
                .start_http(&format!("127.0.0.1:50001").parse().unwrap())
                .expect("Unable to start RPC HTTP server");
            println!("running server");
            server.wait();
        })
        .await
        .unwrap();
    }
}

type RPCResult<T> = jsonrpc_core::Result<T>;

/// Definition of all JSON RPC Methods
#[rpc]
pub trait RpcMethods {
    #[rpc(name = "get_state_by_id")]
    fn get_state_by_id(&self, id: u8) -> RPCResult<Option<State>>;
    #[rpc(name = "set_state_by_id")]
    fn set_state_by_id(&self, id: u8, state: State) -> RPCResult<()>;
}

/// JSON RPC manager
pub struct RpcManager {
    pub states: StatesList,
}

/// Implementation of all JSON RPC methods
impl RpcMethods for RpcManager {
    /// Return the state by the given ID if found
    fn get_state_by_id(&self, id: u8) -> RPCResult<Option<State>> {
        let states = self.states.clone();
        if let Some(state) = states.get_state_by_id(id) {
            Ok(Some(state.lock().unwrap().to_owned()))
        } else {
            Ok(None)
        }
    }
    fn set_state_by_id(&self, _id: u8, _state: State) -> RPCResult<()> {
        todo!()
    }
}
