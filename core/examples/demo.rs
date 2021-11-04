use std::sync::{
    Arc,
    Mutex,
};

use graviton_core::{
    Configuration,
    Core,
    StatesList,
};

#[tokio::main]
async fn main() {
    // Create the configuration
    let config = Arc::new(Mutex::new(Configuration::new()));

    // Create an empty states list
    let states = StatesList::new();

    // Create a new config passing the configuration
    let core = Core::new(config, states);

    core.run().await;
}
