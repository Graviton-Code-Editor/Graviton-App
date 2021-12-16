use gveditor_core_api::{
    extensions::base::Extension,
    extensions_manager::ExtensionsManager,
    messaging::Messages,
    tokio::sync::mpsc::Sender,
};
use std::{
    thread,
    time::Duration,
};

#[allow(dead_code)]
struct GitExtension {
    sender: Sender<Messages>,
}

impl Extension for GitExtension {
    fn init(&mut self) {
        println!("Running git extension...");

        thread::spawn(move || loop {
            thread::sleep(Duration::from_millis(500));
            println!("hello...");
        });
    }
}

#[no_mangle]
pub fn entry(extensions: &mut ExtensionsManager, sender: Sender<Messages>) {
    extensions.register(Box::new(GitExtension { sender }));
}
