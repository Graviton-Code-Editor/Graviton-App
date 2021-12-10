use crate::{
    server::{
        RpcManager,
        RpcMethods,
    },
    StatesList,
};
use async_trait::async_trait;
use jsonrpc_core::{
    futures::StreamExt,
    IoHandler,
};
use jsonrpc_http_server::{
    AccessControlAllowOrigin,
    DomainsValidation,
};
use std::sync::{
    Arc,
    Mutex,
};
use warp::Filter;

use super::Transport;

/// Utilities for WebSockets connections
mod ws {
    use jsonrpc_core::{
        futures::{
            SinkExt,
            StreamExt,
        },
        futures_util::stream::{
            SplitSink,
            SplitStream,
        },
        serde_json::{
            self,
            json,
        },
    };
    use std::sync::{
        Arc,
        Mutex,
    };

    use serde::{
        Deserialize,
        Serialize,
    };
    use tokio::sync::Mutex as AsyncMutex;
    use warp::{
        ws::{
            Message,
            WebSocket,
        },
        Filter,
    };

    use crate::{
        transports::Messages,
        State,
        StatesList,
    };

    struct WSMessages;

    impl WSMessages {
        /// Short way to create a `stateUpdated` message
        pub fn state_updated(state: State) -> Message {
            Message::text(
                json!({
                    "msg_type": "StateUpdated",
                    "state": state
                })
                .to_string(),
            )
        }
    }

    #[derive(Deserialize, Serialize)]
    struct AuthOptions {
        token: String,
        state: u8,
    }

    /// Middleware that makes sure the incoming websocket connection has a valid token
    pub async fn auth(
        states: Arc<Mutex<StatesList>>,
    ) -> impl Filter<Extract = ((),), Error = warp::reject::Rejection> + Clone {
        warp::query::<AuthOptions>()
            .map(move |options| (states.clone(), options))
            .and_then({
                |(states, options): (Arc<Mutex<StatesList>>, AuthOptions)| async move {
                    if let Some(state) = states.lock().unwrap().get_state_by_id(options.state) {
                        if state.lock().unwrap().has_token(&options.token) {
                            return Ok(());
                        }
                    }
                    Err(warp::reject::not_found())
                }
            })
    }

    /// Handle a incoming message
    ///
    /// * `message`  - The message to handle
    /// * `states`   - The States list
    /// * `sender`   - The Websocket sender
    async fn handle_message(
        message: Messages,
        states: &Arc<Mutex<StatesList>>,
        sender: &Arc<AsyncMutex<SplitSink<WebSocket, Message>>>,
    ) {
        match message {
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
                    // Send the state
                    sender
                        .lock()
                        .await
                        .send(WSMessages::state_updated(state.lock().unwrap().to_owned()))
                        .await
                        .unwrap();
                }
            }
            Messages::StateUpdated { .. } => {}
        }
    }

    /// Handle a WebSockets connection
    ///
    /// * `states`               - A States list
    /// * `(sender, receiver)`   - The Websockets sender and receiver
    pub fn handler(
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
                    match recv.next().await {
                        Some(Ok(msg)) => {
                            if msg.is_text() {
                                let text = msg.to_str().unwrap();

                                let message: Messages = serde_json::from_str(text).unwrap();

                                // Handle the received message
                                handle_message(message, &states, &sender).await;
                            }
                        }
                        _ => {
                            // Close thread for the particular connection
                            break;
                        }
                    }
                }
            });
        });
    }
}

/*
 * This is the HTTP Transport Handler
 */
pub struct HTTPHandler {
    pub json_rpc_http_cors: DomainsValidation<AccessControlAllowOrigin>,
}

impl HTTPHandler {
    pub fn new(json_rpc_http_cors: DomainsValidation<AccessControlAllowOrigin>) -> Self {
        Self { json_rpc_http_cors }
    }
}

#[async_trait]
impl Transport for HTTPHandler {
    async fn run(&self, states: Arc<Mutex<StatesList>>) {
        let ws_states = states.clone();

        // Create the WebSockets server
        std::thread::spawn(move || {
            let rt = tokio::runtime::Runtime::new().unwrap();
            rt.block_on(async {
                let routes = warp::path("listen")
                    .and(ws::auth(ws_states.clone()).await)
                    .and(warp::ws())
                    .map(move |_, ws: warp::ws::Ws| {
                        let states = ws_states.clone();
                        ws.on_upgrade(async move |websocket| {
                            let (sender, recv) = websocket.split();
                            // Create a different thread of every active connection
                            ws::handler(states.clone(), (sender, recv))
                        })
                    });

                warp::serve(routes).run(([127, 0, 0, 1], 7700)).await;
            });
        });

        // Create the HTTP JSON RPC server
        let mut http_io = IoHandler::default();
        let manager = RpcManager {
            states: states.clone(),
        };
        http_io.extend_with(manager.to_delegate());

        let http_cors = self.json_rpc_http_cors.clone();
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
}
