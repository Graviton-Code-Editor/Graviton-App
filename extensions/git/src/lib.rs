use gveditor_core_api::{
    extensions::{
        base::Extension,
        modules::popup::Popup,
    },
    extensions_manager::ExtensionsManager,
    messaging::{
        ExtensionMessages,
        Messages,
    },
    tokio::{
        runtime::Runtime,
        sync::mpsc::Sender as AsyncSender,
    },
    Mutex,
};
use std::{
    sync::{
        mpsc::{
            channel,
            Receiver,
            Sender,
        },
        Arc,
    },
    thread,
};

#[allow(dead_code)]
struct GitExtension {
    sender: AsyncSender<Messages>,
    state_id: u8,
    rx: Arc<Mutex<Receiver<ExtensionMessages>>>,
    tx: Sender<ExtensionMessages>,
}

impl Extension for GitExtension {
    fn init(&mut self) {
        let receiver = self.rx.clone();
        let external_sender = self.sender.clone();
        let state_id = self.state_id;
        thread::spawn(move || {
            Runtime::new().unwrap().block_on(async move {
                let receiver = receiver.lock().await;
                loop {
                    if let Ok(ExtensionMessages::ReadFile(_, info)) = receiver.recv() {
                        if let Ok(info) = info {
                            let popup = Popup::new(
                                external_sender.clone(),
                                state_id,
                                "you opened",
                                &info.path,
                            );
                            popup.show().await;
                        }
                    }
                }
            });
        });
    }

    fn notify(&mut self, message: ExtensionMessages) {
        self.tx.send(message).unwrap();
    }
}

#[no_mangle]
pub fn entry(extensions: &mut ExtensionsManager, sender: AsyncSender<Messages>, state_id: u8) {
    let (tx, rx) = channel::<ExtensionMessages>();
    let rx = Arc::new(Mutex::new(rx));
    extensions.register(Box::new(GitExtension {
        sender,
        state_id,
        rx,
        tx,
    }));
}
