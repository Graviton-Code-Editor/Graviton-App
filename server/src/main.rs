use std::sync::Arc;
use std::thread;

use gveditor_core::handlers::HTTPHandler;
use gveditor_core::{Configuration, Server};
use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::messaging::ClientMessages;
use gveditor_core_api::state::{MemoryPersistor, StatesList, TokenFlags};
use gveditor_core_api::tokio::sync::mpsc::channel;
use gveditor_core_api::{Mutex, State};

#[tokio::main]
async fn main() {
    let (to_core, from_core) = channel::<ClientMessages>(1);

    let extensions_manager = ExtensionsManager::new(to_core.clone(), None)
        .load_extension_from_entry(git_for_graviton::entry, git_for_graviton::get_info(), 1)
        .await
        .to_owned();

    let states = {
        let sample_state = State::new(1, extensions_manager, Box::new(MemoryPersistor::new()));

        let states = StatesList::new()
            .with_tokens(&[TokenFlags::All("test".to_string())])
            .with_state(sample_state);

        Arc::new(Mutex::new(states))
    };

    let http_handler = HTTPHandler::builder().build().wrap();

    let config = Configuration::new(http_handler, to_core, from_core);

    let core = Server::new(config, states);

    core.run().await;

    println!("Open http://localhost:8080/?state=0&token=test");

    thread::park();
}
