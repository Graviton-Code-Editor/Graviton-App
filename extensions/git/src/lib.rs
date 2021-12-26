use git2::Repository;
use gveditor_core_api::extensions::base::{
    Extension,
    ExtensionInfo,
};
use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::extensions::modules::statusbar_item::StatusBarItem;
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
    fn get_info(&self) -> ExtensionInfo {
        ExtensionInfo {
            id: env!("CARGO_PKG_NAME").to_string(),
            name: env!("CARGO_PKG_NAME").to_string(),
        }
    }

    fn init(&mut self) {
        let receiver = self.rx.clone();
        let external_sender = self.sender.clone();
        let state_id = self.state_id;
        thread::spawn(move || {
            Runtime::new().unwrap().block_on(async move {
                let receiver = receiver.lock().await;
                loop {
                    if let Ok(ExtensionMessages::ListDir(_, fs_name, path, _)) = receiver.recv() {
                        // Only react when using the local file system
                        if fs_name == "local" {
                            Self::handle_list_dir(external_sender.clone(), state_id, path).await;
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
    let plugin = Box::new(GitExtension {
        sender,
        state_id,
        rx,
        tx,
    });
    let parent_id = env!("CARGO_PKG_NAME");
    extensions.register(parent_id, plugin);
}
