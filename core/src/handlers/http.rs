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
    futures_util::{
        stream::SplitSink,
        SinkExt,
    },
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
use tokio::sync::{
    mpsc::Sender,
    Mutex as AsyncMutex,
};
use warp::{
    ws::{
        Message,
        WebSocket,
    },
    Filter,
};

use jsonrpc_core::{
    futures_util::stream::SplitStream,
    serde_json::{
        self,
        json,
    },
};

use serde::{
    Deserialize,
    Serialize,
};

use crate::handlers::Messages;

use super::TransportHandler;

/// Easily convert variants of Messages to WebSocket messages
pub struct WSMessages;

impl WSMessages {
    pub fn from_message(message: &Messages) -> Option<Message> {
        match message {
            Messages::StateUpdated { state } => Some(Message::text(
                json!({
                    "msg_type": "StateUpdated",
                    "state": state
                })
                .to_string(),
            )),
            _ => None,
        }
    }
}

#[derive(Deserialize, Serialize)]
struct AuthOptions {
    token: String,
    state: u8,
}

/// Middleware that makes sure the incoming websocket connection has a valid token
pub async fn ws_auth(
    states: Arc<Mutex<StatesList>>,
) -> impl Filter<Extract = ((),), Error = warp::reject::Rejection> + Clone {
    warp::query::<AuthOptions>()
        .map(move |options| (states.clone(), options))
        .and_then({
            |(states, options): (Arc<Mutex<StatesList>>, AuthOptions)| async move {
                // Lookup for the requested state
                if let Some(state) = states.lock().unwrap().get_state_by_id(options.state) {
                    // If found, then make sure the token is valid
                    if state.lock().unwrap().has_token(&options.token) {
                        return Ok(());
                    }
                }
                Err(warp::reject::not_found())
            }
        })
}

type SocketsRegistry = Arc<AsyncMutex<Vec<(Arc<AsyncMutex<SplitSink<WebSocket, Message>>>, u8)>>>;

/// Handle a WebSockets connection
///
/// * `states`               - A States list
/// * `core_sender`          - A sender to communicate to the Core
/// * `(sender, receiver)`   - The Websockets sender and receiver
pub fn ws_handler(
    sockets: SocketsRegistry,
    core_sender: Arc<Mutex<Sender<Messages>>>,
    (sender, recv): (SplitSink<WebSocket, Message>, SplitStream<WebSocket>),
) {
    let sender = Arc::new(AsyncMutex::new(sender));
    let recv = Arc::new(AsyncMutex::new(recv));

    std::thread::spawn(move || {
        let sockets = sockets.clone();
        let runtime = tokio::runtime::Runtime::new().unwrap();
        runtime.block_on(async {
            loop {
                let mut recv = recv.lock().await;
                // Listen for incomming messages
                match recv.next().await {
                    Some(Ok(msg)) => {
                        if msg.is_text() {
                            let text = msg.to_str().unwrap();

                            let message: Messages = serde_json::from_str(text).unwrap();

                            // Save the WebSocket if it just subscribed
                            if let Messages::ListenToState { state_id, .. } = message {
                                sockets.lock().await.push((sender.clone(), state_id));
                            }

                            core_sender.lock().unwrap().send(message).await.unwrap();
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

/// This is the HTTP Handler
pub struct HTTPHandler {
    pub json_rpc_http_cors: DomainsValidation<AccessControlAllowOrigin>,
    pub sockets: SocketsRegistry,
}

impl HTTPHandler {
    pub fn new(json_rpc_http_cors: DomainsValidation<AccessControlAllowOrigin>) -> Self {
        Self {
            json_rpc_http_cors,
            sockets: Arc::new(AsyncMutex::new(Vec::new())),
        }
    }

    /// Easily send a message to all websockets in it's state ID
    async fn send_message_to_web_socket(&self, message: Messages) {
        let msg_state_id = message.get_state_id();
        let sockets = &*self.sockets.lock().await;
        for (websocket, state_id) in sockets {
            if msg_state_id == *state_id {
                if let Some(message) = WSMessages::from_message(&message) {
                    let sent_message = websocket.lock().await.send(message).await;

                    match sent_message {
                        Ok(_) => {}
                        Err(_err) => {
                            // Handle error
                        }
                    }
                }
            }
        }
    }

    /// Create WebSockets server
    fn create_ws_server(
        &self,
        states: Arc<Mutex<StatesList>>,
        core_sender: Arc<Mutex<Sender<Messages>>>,
    ) {
        let sockets = self.sockets.clone();

        std::thread::spawn(move || {
            let rt = tokio::runtime::Runtime::new().unwrap();

            rt.block_on(async {
                let routes = warp::path("listen")
                    .and(ws_auth(states.clone()).await)
                    .and(warp::ws())
                    .map(move |_, ws: warp::ws::Ws| {
                        let sockets = sockets.clone();
                        let core_sender = core_sender.clone();
                        ws.on_upgrade(async move |websocket| {
                            let (sender, recv) = websocket.split();
                            // Handle every new connection
                            ws_handler(sockets, core_sender, (sender, recv));
                        })
                    });

                warp::serve(routes).run(([127, 0, 0, 1], 7700)).await;
            });
        });
    }

    // Create the HTTP JSON RPC Server
    async fn create_http_json_rpc_server(&self, states: Arc<Mutex<StatesList>>) {
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

#[async_trait]
impl TransportHandler for HTTPHandler {
    async fn run(
        &mut self,
        states: Arc<Mutex<StatesList>>,
        core_sender: Arc<Mutex<Sender<Messages>>>,
    ) {
        self.create_ws_server(states.clone(), core_sender);
        self.create_http_json_rpc_server(states).await;
    }

    async fn send(&self, message: Messages) {
        self.send_message_to_web_socket(message).await;
    }
}
