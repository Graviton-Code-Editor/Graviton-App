use std::sync::Arc;
use std::thread;

use gveditor_core::handlers::HTTPHandler;
use gveditor_core::{Configuration, Server};
use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::messaging::ClientMessages;
use gveditor_core_api::states::{MemoryPersistor, StatesList, TokenFlags};
use gveditor_core_api::{Mutex, State};
use tokio::sync::mpsc::channel;

#[tokio::main]
async fn main() {
    let (to_server, from_server) = channel::<ClientMessages>(1);

    let states = {
        let sample_state = State::new(
            1,
            ExtensionsManager::new(to_server.clone(), None),
            Box::new(MemoryPersistor::new()),
        );

        let states = StatesList::new()
            .with_tokens(&[TokenFlags::All("test".to_string())])
            .with_state(sample_state);

        Arc::new(Mutex::new(states))
    };

    let http_handler = HTTPHandler::builder().build().wrap();

    let config = Configuration::new(http_handler, to_server, from_server);

    let server = Server::new(config, states);

    server.run().await;

    thread::park();
}
