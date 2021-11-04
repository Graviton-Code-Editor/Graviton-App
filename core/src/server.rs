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
    states: StatesList,
}

impl Server {
    /// Create a new Server
    pub fn new(states: StatesList) -> Self {
        Self { states }
    }

    /// Start the JSON RPC HTTP Server and WebSockets server
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

                        // Create a different thread of every active connection
                        Self::handle_ws_listener(states, (sender, recv))
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
                .start_http(&"127.0.0.1:50001".to_string().parse().unwrap())
                .expect("Unable to start RPC HTTP server");
            println!("running server");
            server.wait();
        })
        .await
        .unwrap();
    }

    /// Handle the socket connection of a listener
    fn handle_ws_listener(
        states: StatesList,
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
                                    let state =
                                        if let Some(state) = states.get_state_by_id(state_id) {
                                            state.lock().unwrap().to_owned()
                                        } else {
                                            State::default()
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
