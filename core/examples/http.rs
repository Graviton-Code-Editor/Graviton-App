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
    State,
    StatesList,
};

#[tokio::main]
async fn main() {
    let states = {
        let sample_state = State::new(1, vec![]);

        let states = StatesList::new().with_state(sample_state);

        Arc::new(Mutex::new(states))
    };

    let http_handler = HTTPHandler::builder().build().wrap();

    let config = Configuration::new(http_handler);

    let core = Core::new(config, states);

    core.run().await;

    thread::park();
}
