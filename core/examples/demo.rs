use home::home_dir;
use std::{
    fs,
    sync::{
        Arc,
        Mutex,
    },
};

use graviton_core::{
    Configuration,
    Core,
    State,
    StatesList,
    TokenFlags,
};

#[tokio::main]
async fn main() {
    // Create the configuration
    let config = Arc::new(Mutex::new(Configuration::new()));

    // Create an empty states list
    let mut states = StatesList::new();
    let states = states.with_tokens(&vec![TokenFlags::All("demo_secret_token".to_string())]);
    let mut demo_state = State::new(1);
    states.add_state(&mut demo_state);

    if let Some(home) = home_dir() {
        fs::write(
            format!("{}/graviton_local_token", home.to_str().unwrap()),
            "demo_secret_token".as_bytes(),
        )
        .unwrap();
    }

    // Create a new config passing the configuration
    let core = Core::new(config, states.to_owned());

    core.run().await;
}
