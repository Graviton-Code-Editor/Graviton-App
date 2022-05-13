use std::sync::Arc;
use std::thread;

use gveditor_core::handlers::HTTPHandler;
use gveditor_core::{Configuration, Core};
use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::messaging::Messages;
use gveditor_core_api::state::{MemoryPersistor, StatesList, TokenFlags};
use gveditor_core_api::{Mutex, State};
use tokio::sync::mpsc::channel;

#[tokio::main]
async fn main() {
    let (to_core, from_core) = channel::<Messages>(1);
    let from_core = Arc::new(Mutex::new(from_core));

    let states = {
        let sample_state = State::new(
            1,
            ExtensionsManager::new(to_core.clone(), None),
            Box::new(MemoryPersistor::new()),
        );

        let states = StatesList::new()
            .with_tokens(&[TokenFlags::All("test".to_string())])
            .with_state(sample_state);

        Arc::new(Mutex::new(states))
    };

    let http_handler = HTTPHandler::builder().build().wrap();

    let config = Configuration::new(http_handler, to_core, from_core);

    let core = Core::new(config, states);

    core.run().await;

    thread::park();
}
