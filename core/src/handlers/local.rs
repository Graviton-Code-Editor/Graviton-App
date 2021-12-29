use super::TransportHandler;
use crate::server::gen_client::Client;
use crate::server::{
    RpcManager,
    RpcMethods,
};
use crate::StatesList;
use async_trait::async_trait;
use gveditor_core_api::messaging::Messages;
use jsonrpc_core::IoHandler;
use jsonrpc_core_client::transports::local;
use std::sync::{
    Arc,
    Mutex,
};
use std::thread;
use tokio::sync::mpsc::{
    channel,
    Receiver,
    Sender,
};

/// This a local handler, meaning that you can use the JSON RPC Server directly
pub struct LocalHandler {
    receiver_to_local: Arc<Mutex<Receiver<Messages>>>,
    channel_sender: Sender<Messages>,
}

impl LocalHandler {
    pub fn new(
        states: Arc<Mutex<StatesList>>,
        channel_sender: Sender<Messages>,
    ) -> (Self, Client, Sender<Messages>) {
        // Create the RPC Handler
        let mut local_io = IoHandler::new();
        let manager = RpcManager { states };
        local_io.extend_with(manager.to_delegate());

        // Create the channel handler
        let (sender_to_local, receiver_to_local) = channel::<Messages>(1);
        let receiver_to_local = Arc::new(Mutex::new(receiver_to_local));

        // Create the local JSON RPC instance
        let (client, server) = local::connect::<Client, _, _>(local_io);
        tokio::task::spawn(async { server.await });

        let local = Self {
            receiver_to_local,
            channel_sender,
        };

        (local, client, sender_to_local)
    }
}

#[async_trait]
impl TransportHandler for LocalHandler {
    async fn run(&mut self, _: Arc<Mutex<StatesList>>, core_sender: Sender<Messages>) {
        let rv = self.receiver_to_local.clone();

        thread::spawn(move || {
            let mut rv = rv.lock().unwrap();
            let runtime = tokio::runtime::Runtime::new().unwrap();
            runtime.block_on(async {
                loop {
                    if let Some(msg) = rv.recv().await {
                        core_sender.send(msg).await.unwrap();
                    }
                }
            });
        });
    }

    async fn send(&self, message: Messages) {
        self.channel_sender.send(message).await.unwrap();
    }
}

#[cfg(test)]
mod tests {

    use std::sync::{
        Arc,
        Mutex,
    };

    use gveditor_core_api::extensions::manager::ExtensionsManager;
    use gveditor_core_api::state::TokenFlags;
    use gveditor_core_api::State;

    use tokio::runtime::Runtime;
    use tokio::sync::mpsc::channel;

    use crate::StatesList;

    use super::LocalHandler;

    #[test]
    fn json_rpc_works() {
        let rt = Runtime::new().unwrap();

        rt.block_on(async {
            let (core_sender, _) = channel(1);

            // Sample StatesList
            let states = {
                let sample_state = State::new(1, ExtensionsManager::new(core_sender.clone()));

                // A StatesList with the previous state
                let states = StatesList::new()
                    .with_tokens(&[TokenFlags::All("test_token".to_string())])
                    .with_state(sample_state);
                Arc::new(Mutex::new(states))
            };

            // Crate the local handler
            let (_, client, _) = LocalHandler::new(states, core_sender);

            // Use the client to call JSON RPC Methods
            let req = client
                .read_file_by_path(
                    "./readme.md".to_string(),
                    "local".to_string(),
                    1,
                    "test_token".to_string(),
                )
                .await;

            assert!(req.is_ok());
        });
    }
}
