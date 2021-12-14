use crate::{
    server::{
        RpcManager,
        RpcMethods,
    },
    StatesList,
};
use async_trait::async_trait;
use hyper_tungstenite::{
    hyper::{
        self,
        upgrade::Upgraded,
    },
    tungstenite::{
        self,
        Message,
    },
    HyperWebsocket,
    WebSocketStream,
};
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
    RequestMiddleware,
    RequestMiddlewareAction,
    RestApi,
};
use std::{
    collections::HashMap,
    sync::{
        Arc,
        Mutex,
    },
    thread,
};
use tokio::{
    runtime::Runtime,
    sync::{
        mpsc::Sender,
        Mutex as AsyncMutex,
    },
};

use crate::handlers::Messages;
use jsonrpc_core::serde_json::{
    self,
    json,
};

use super::TransportHandler;

pub struct HTTPHandlerBuilder {
    cors: DomainsValidation<AccessControlAllowOrigin>,
    port: u16,
}

impl Default for HTTPHandlerBuilder {
    fn default() -> Self {
        Self::new()
    }
}

impl HTTPHandlerBuilder {
    pub fn new() -> Self {
        Self {
            cors: DomainsValidation::Disabled,
            port: 50010,
        }
    }

    pub fn cors(&mut self, cors: DomainsValidation<AccessControlAllowOrigin>) -> &mut Self {
        self.cors = cors;
        self
    }

    pub fn port(&mut self, port: u16) -> &mut Self {
        self.port = port;
        self
    }

    pub fn build(&self) -> HTTPHandler {
        HTTPHandler::new(self.cors.clone(), self.port)
    }
}

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

type SocketsRegistry = Arc<
    AsyncMutex<
        Vec<(
            Arc<AsyncMutex<SplitSink<WebSocketStream<Upgraded>, tungstenite::Message>>>,
            u8,
        )>,
    >,
>;


/// WebSockets middleware for HTTP JSON RPC
struct WebSocketsManager {
    sockets: SocketsRegistry,
    core_sender: Arc<Mutex<Sender<Messages>>>,
    states: Arc<Mutex<StatesList>>,
}

impl RequestMiddleware for WebSocketsManager {
    // This acts as a Middleware to upgrade requests  on `/websockets` to actual WebSockets connections
    fn on_request(
        &self,
        request: jsonrpc_http_server::hyper::Request<jsonrpc_http_server::hyper::Body>,
    ) -> RequestMiddlewareAction {
        // Authentificate the websockets connection
        if !Self::auth_ws(&request, &self.states) {
            return request.into();
        }

        match request.uri().path() {
            "/websockets" => {
                if hyper_tungstenite::is_upgrade_request(&request) {
                    let (response, websocket) = hyper_tungstenite::upgrade(request, None).unwrap();

                    // Handle the WebSocket connection
                    Self::handle_ws(self.sockets.clone(), self.core_sender.clone(), websocket);

                    // Return the response so the spawned future can continue.
                    response.into()
                } else {
                    request.into()
                }
            }
            _ => request.into(),
        }
    }
}

impl WebSocketsManager {
    /// Authenticate the Websocket by querying the URL
    ///
    /// * `sockets`              - The Hyper request
    /// * `core_sender`          - A sender to communicate to the Core
    /// * `states`               - A States list
    pub fn new(
        sockets: SocketsRegistry,
        core_sender: Arc<Mutex<Sender<Messages>>>,
        states: Arc<Mutex<StatesList>>,
    ) -> Self {
        Self {
            sockets,
            core_sender,
            states,
        }
    }

    /// Authenticate the Websocket by querying the URL
    ///
    /// * `request`           - The Hyper request
    /// * `states`            - A States list
    pub fn auth_ws(request: &hyper::Request<hyper::Body>, states: &Arc<Mutex<StatesList>>) -> bool {
        let url = request.uri();
        // Create a URL to so the parameters can be queried
        let url = url::Url::parse(&format!("ws://locahost{}", &url.to_string())).unwrap();
        // Get tha parameters
        let parameters: HashMap<String, String> = url.query_pairs().into_owned().collect();
        let token = parameters.get("token");
        let state_id = parameters.get("state_id");

        if let (Some(token), Some(state_id)) = (token, state_id) {
            let state_id = state_id.parse::<u8>();
            if let Ok(state_id) = state_id {
                if let Some(state) = states.lock().unwrap().get_state_by_id(state_id) {
                    // If found, then make sure the token is valid
                    state.lock().unwrap().has_token(token)
                } else {
                    false
                }
            } else {
                false
            }
        } else {
            false
        }
    }

    /// Handle a WebSockets connection
    ///
    /// * `states`               - A States list
    /// * `core_sender`          - A sender to communicate to the Core
    /// * `websocklet`           - The Websockets connection
    pub fn handle_ws(
        sockets: SocketsRegistry,
        core_sender: Arc<Mutex<Sender<Messages>>>,
        websocket: HyperWebsocket,
    ) {
        std::thread::spawn(move || {
            let sockets = sockets.clone();
            let runtime = Runtime::new().unwrap();
            runtime.block_on(async {
                let websocket = websocket.await.unwrap();
                let (sender, mut recv) = websocket.split();
                let sender = Arc::new(AsyncMutex::new(sender));

                // Handle new incoming message in the ws connection
                while let Some(Ok(message)) = recv.next().await {
                    if let Message::Text(msg) = message {
                        if let Ok(message) = serde_json::from_str::<Messages>(&msg) {
                            // Save the WebSocket if it just subscribed
                            if let Messages::ListenToState { state_id, .. } = message {
                                sockets.lock().await.push((sender.clone(), state_id));
                            }

                            // Forward the message to the core
                            core_sender.lock().unwrap().send(message).await.unwrap();
                        } else {
                            // not json
                        }
                    } else {
                        // not text
                    }
                }
            });
        });
    }
}

/// This is the HTTP Handler
pub struct HTTPHandler {
    pub json_rpc_http_cors: DomainsValidation<AccessControlAllowOrigin>,
    pub sockets: SocketsRegistry,
    pub port: u16,
}

impl HTTPHandler {
    pub fn new(json_rpc_http_cors: DomainsValidation<AccessControlAllowOrigin>, port: u16) -> Self {
        Self {
            json_rpc_http_cors,
            sockets: Arc::new(AsyncMutex::new(Vec::new())),
            port,
        }
    }

    /// Shortcut to builder
    pub fn builder() -> HTTPHandlerBuilder {
        HTTPHandlerBuilder::new()
    }

    pub fn wrap(self) -> Box<dyn TransportHandler + Send + Sync> {
        Box::new(self)
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

    // Create the HTTP JSON RPC Server
    async fn create_server(
        &self,
        states: Arc<Mutex<StatesList>>,
        core_sender: Arc<Mutex<Sender<Messages>>>,
    ) {
        // Create a WebSockets Manager which acts as Middleware
        let ws_middleware =
            WebSocketsManager::new(self.sockets.clone(), core_sender, states.clone());

        // Create the HTTP JSON RPC server
        let mut http_io = IoHandler::default();
        let manager = RpcManager { states };
        http_io.extend_with(manager.to_delegate());

        let http_cors = self.json_rpc_http_cors.clone();
        let http_port = self.port;

        // Run the HTTP JSON RPC in a separate thread
        thread::spawn(move || {
            let server = jsonrpc_http_server::ServerBuilder::new(http_io)
                .request_middleware(ws_middleware)
                .cors(http_cors)
                .rest_api(RestApi::Unsecure)
                .start_http(&format!("127.0.0.1:{}", http_port).parse().unwrap())
                .expect("Unable to start RPC HTTP server");
            server.wait();
        });
    }
}

#[async_trait]
impl TransportHandler for HTTPHandler {
    async fn run(
        &mut self,
        states: Arc<Mutex<StatesList>>,
        core_sender: Arc<Mutex<Sender<Messages>>>,
    ) {
        self.create_server(states, core_sender).await;
    }

    async fn send(&self, message: Messages) {
        self.send_message_to_web_socket(message).await;
    }
}

#[cfg(test)]
mod tests {

    use std::sync::{
        Arc,
        Mutex,
    };

    use hyper_tungstenite::tungstenite::{
        connect,
        Message,
    };
    use jsonrpc_core::serde_json::{
        self,
        json,
    };
    use tokio::runtime::Runtime;
    use url::Url;

    use crate::{
        handlers::Messages,
        Configuration,
        Core,
        State,
        StatesList,
        TokenFlags,
    };

    use super::HTTPHandler;

    #[test]
    fn json_rpc_works() {
        let rt = Runtime::new().unwrap();
        rt.block_on(async {
            // RUN THE SERVER

            let states = {
                let sample_state = State::new(1, vec![]);

                let states = StatesList::new()
                    .with_tokens(&[TokenFlags::All("test".to_string())])
                    .with_state(sample_state);

                Arc::new(Mutex::new(states))
            };

            let http_handler = HTTPHandler::builder().build().wrap();

            let config = Configuration::new(http_handler);

            let core = Core::new(config, states);

            core.run().await;

            // RUN A WEBSOCKETS CLIENT

            let (mut socket, _) = connect(
                Url::parse("ws://localhost:50010/websockets?token=test&state_id=1").unwrap(),
            )
            .expect("Can't connect");

            let listen_to_state_msg = json!({
                "msg_type": "ListenToState",
                "state_id": 1 as u16,
                "trigger": "client"
            })
            .to_string();

            socket
                .write_message(Message::Text(listen_to_state_msg))
                .unwrap();

            let msg = socket.read_message().expect("Error reading message");

            assert!(msg.is_text());

            let msg = msg.into_text().unwrap();

            let state_updated_msg = serde_json::from_str(&msg).unwrap();

            assert!(matches!(state_updated_msg, Messages::StateUpdated { .. }))

            // TO-DO TEST JSON RPC CLIENT
        });
    }
}
