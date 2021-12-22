use git2::Repository;
use gveditor_core_api::extensions::base::Extension;
use gveditor_core_api::extensions::modules::statusbar_item::StatusBarItem;
use gveditor_core_api::extensions_manager::ExtensionsManager;
use gveditor_core_api::messaging::{
    ExtensionMessages,
    Messages,
};
use gveditor_core_api::tokio::runtime::Runtime;
use gveditor_core_api::tokio::sync::mpsc::Sender as AsyncSender;
use gveditor_core_api::Mutex;
use std::sync::mpsc::{
    channel,
    Receiver,
    Sender,
};
use std::sync::Arc;
use std::thread;

struct GitExtension {
    sender: AsyncSender<Messages>,
    state_id: u8,
    rx: Arc<Mutex<Receiver<ExtensionMessages>>>,
    tx: Sender<ExtensionMessages>,
}

impl GitExtension {
    /// Handle ListDir events
    /// Note: The errors should be better handled
    pub async fn handle_list_dir(
        external_sender: AsyncSender<Messages>,
        state_id: u8,
        path: String,
    ) {
        let repo = Repository::discover(path);
        if let Ok(repo) = repo {
            if let Ok(head) = repo.head() {
                let branch = head.shorthand();
                if let Some(branch) = branch {
                    let statusbar_item =
                        StatusBarItem::new(external_sender.clone(), state_id, branch);
                    statusbar_item.show().await;
                } else {
                    println!("Can't format head");
                }
            } else {
                println!("Head not found");
            }
        } else {
            println!("Repo not found");
        }
    }
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
                    if let Ok(ExtensionMessages::ListDir(_, path, _)) = receiver.recv() {
                        Self::handle_list_dir(external_sender.clone(), state_id, path).await;
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
