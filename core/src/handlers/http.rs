use crate::server::{RpcManager, RpcMethods};
use crate::StatesList;
use async_trait::async_trait;
use gveditor_core_api::messaging::Messages;
use hyper_tungstenite::hyper::upgrade::Upgraded;
use hyper_tungstenite::tungstenite::{self, Message};
use hyper_tungstenite::{hyper, HyperWebsocket, WebSocketStream};
use jsonrpc_core::futures::StreamExt;
use jsonrpc_core::futures_executor::block_on;
use jsonrpc_core::futures_util::stream::SplitSink;
use jsonrpc_core::futures_util::SinkExt;
use jsonrpc_core::IoHandler;
use jsonrpc_http_server::{
    AccessControlAllowOrigin, DomainsValidation, RequestMiddleware, RequestMiddlewareAction,
    RestApi,
};
use std::collections::HashMap;
use std::sync::Arc;
use std::thread;
use tokio::runtime::Runtime;
use tokio::sync::mpsc::Sender;
use tokio::sync::Mutex;

use jsonrpc_core::serde_json;

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
        let message_str = serde_json::to_string(message);
        if let Ok(message_str) = message_str {
            Some(Message::text(message_str))
        } else {
            None
        }
    }
}

type SocketsRegistry = Arc<
    Mutex<
        Vec<(
            Arc<Mutex<SplitSink<WebSocketStream<Upgraded>, tungstenite::Message>>>,
            u8,
        )>,
    >,
>;

/// WebSockets middleware for HTTP JSON RPC
struct WebSocketsManager {
    sockets: SocketsRegistry,
    core_sender: Sender<Messages>,
    states: Arc<Mutex<StatesList>>,
}

impl RequestMiddleware for WebSocketsManager {
    // This acts as a Middleware to upgrade requests  on `/websockets` to actual WebSockets connections
    fn on_request(
        &self,
        request: jsonrpc_http_server::hyper::Request<jsonrpc_http_server::hyper::Body>,
    ) -> RequestMiddlewareAction {
        // Authentificate the websockets connection
        // TODO: Don't use block_on
        if !block_on(Self::auth_ws(&request, &self.states)) {
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
        core_sender: Sender<Messages>,
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
    pub async fn auth_ws(
        request: &hyper::Request<hyper::Body>,
        states: &Arc<Mutex<StatesList>>,
    ) -> bool {
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
                if let Some(state) = states.lock().await.get_state_by_id(state_id) {
                    // If found, then make sure the token is valid
                    state.lock().await.has_token(token)
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
    /// * `websocket`           - The Websockets connection
    pub fn handle_ws(
        sockets: SocketsRegistry,
        core_sender: Sender<Messages>,
        websocket: HyperWebsocket,
    ) {
        std::thread::spawn(move || {
            let sockets = sockets.clone();
            let runtime = Runtime::new().unwrap();
            runtime.block_on(async {
                let websocket = websocket.await.unwrap();
                let (sender, mut recv) = websocket.split();
                let sender = Arc::new(Mutex::new(sender));

                // Handle new incoming message in the ws connection
                while let Some(Ok(message)) = recv.next().await {
                    if let Message::Text(msg) = message {
                        if let Ok(message) = serde_json::from_str::<Messages>(&msg) {
                            // Save the WebSocket if it just subscribed
                            if let Messages::ListenToState { state_id, .. } = message {
                                sockets.lock().await.push((sender.clone(), state_id));
                            }

                            // Forward the message to the core
                            core_sender.send(message).await.unwrap();
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
            sockets: Arc::new(Mutex::new(Vec::new())),
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
    async fn create_server(&self, states: Arc<Mutex<StatesList>>, core_sender: Sender<Messages>) {
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
    async fn run(&mut self, states: Arc<Mutex<StatesList>>, core_sender: Sender<Messages>) {
        self.create_server(states, core_sender).await;
    }

    async fn send(&self, message: Messages) {
        self.send_message_to_web_socket(message).await;
    }
}

#[cfg(test)]
mod tests {

    use std::sync::Arc;
    use std::time::Duration;

    use gveditor_core_api::state::TokenFlags;
    use gveditor_core_api::{Mutex, State};
    use hyper_tungstenite::tungstenite::Message;
    use jsonrpc_core::futures_util::{SinkExt, StreamExt};
    use jsonrpc_core::serde_json;
    use tokio::sync::mpsc::channel;
    use tokio::time::sleep;
    use url::Url;

    use crate::handlers::Messages;
    use crate::{Configuration, Server, StatesList};

    use super::HTTPHandler;

    #[tokio::test]
    async fn json_rpc_works() {
        // RUN THE SERVER

        let (to_core, from_core) = channel::<Messages>(1);

        let states = {
            let sample_state = State::default();

            let states = StatesList::new()
                .with_tokens(&[TokenFlags::All("test".to_string())])
                .with_state(sample_state);

            Arc::new(Mutex::new(states))
        };

        let http_handler = HTTPHandler::builder().build().wrap();

        let config = Configuration::new(http_handler, to_core, from_core);

        let core = Server::new(config, states);

        core.run().await;

        sleep(Duration::from_secs(2)).await;

        // RUN A WEBSOCKETS CLIENT

        let (socket, _) = tokio_tungstenite::connect_async(
            Url::parse("ws://localhost:50010/websockets?token=test&state_id=1").unwrap(),
        )
        .await
        .unwrap();

        let (mut writer, mut reader) = socket.split();

        let listen_to_state_msg = Messages::ListenToState {
            state_id: 1,
            trigger: "client".to_string(),
        };

        let listen_to_state_msg = serde_json::to_string(&listen_to_state_msg).unwrap();

        tokio::spawn(async move {
            writer
                .send(Message::Text(listen_to_state_msg))
                .await
                .unwrap();
        });

        let msg = reader.next().await.unwrap().unwrap();

        assert!(msg.is_text());

        let msg = msg.into_text().unwrap();

        let state_updated_msg = serde_json::from_str(&msg).unwrap();

        assert!(matches!(state_updated_msg, Messages::StateUpdated { .. }));

        // TODO(marc2332) TEST JSON RPC CLIENT
    }
}
