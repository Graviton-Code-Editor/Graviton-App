use gveditor_core_api::{
    extensions::{
        base::Extension,
        modules::popup::Popup,
    },
    extensions_manager::ExtensionsManager,
    messaging::Messages,
    tokio::{
        self,
        sync::mpsc::Sender,
    },
};
use std::{
    thread,
    time::Duration,
};

#[allow(dead_code)]
struct GitExtension {
    sender: Sender<Messages>,
    state_id: u8,
}

impl Extension for GitExtension {
    fn init(&mut self) {
        let popup = Popup::new(self.sender.clone(), self.state_id, "Welcome", "Hello World");
        thread::spawn(|| {
            let rt = tokio::runtime::Runtime::new().unwrap();
            rt.block_on(async move {
                thread::sleep(Duration::from_millis(5000));
                popup.show().await;
            });
        });
    }
}

#[no_mangle]
pub fn entry(extensions: &mut ExtensionsManager, sender: Sender<Messages>, state_id: u8) {
    extensions.register(Box::new(GitExtension { sender, state_id }));
}
