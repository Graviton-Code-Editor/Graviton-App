use std::{
    sync::{
        Arc,
        Mutex,
    },
    thread,
};

use gveditor_core::{
    handlers::HTTPHandler,
    Configuration,
    Core,
};
use gveditor_core_api::{
    extensions_manager::ExtensionsManager,
    messaging::Messages,
    state::{
        StatesList,
        TokenFlags,
    },
    State,
};
use tokio::sync::{
    mpsc::channel,
    Mutex as AsyncMutex,
};

#[tokio::main]
async fn main() {
    let (to_core, from_core) = channel::<Messages>(1);
    let from_core = Arc::new(AsyncMutex::new(from_core));

    let states = {
        let sample_state = State::new(1, ExtensionsManager::default());

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
