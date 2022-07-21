use async_trait::async_trait;
use crosspty::platforms::new_pty;
use crosspty::Pty;
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::messaging::{ClientMessages, ServerMessages};
use gveditor_core_api::terminal_shells::{
    TerminalShell, TerminalShellBuilder, TerminalShellBuilderInfo,
};
use gveditor_core_api::tokio;
use gveditor_core_api::tokio::sync::mpsc::channel;

pub struct NativeShellBuilder {
    pub state_id: u8,
    pub client: ExtensionClient,
    pub command: String,
    pub info: TerminalShellBuilderInfo,
}

impl TerminalShellBuilder for NativeShellBuilder {
    fn get_info(&self) -> TerminalShellBuilderInfo {
        self.info.clone()
    }

    fn build(&self, terminal_shell_id: &str) -> Box<dyn TerminalShell + Send + Sync> {
        let client = self.client.clone();
        let terminal_shell_id = terminal_shell_id.to_owned();
        let state_id = self.state_id;

        let (tx, mut rx) = channel::<Vec<u8>>(1);
        let pty = new_pty(&self.command, vec![], tx);

        let shell = Box::new(NativeShell { pty });

        tokio::spawn(async move {
            loop {
                let data = rx.recv().await.unwrap();
                client
                    .send(ClientMessages::ServerMessage(
                        ServerMessages::TerminalShellUpdated {
                            data,
                            state_id,
                            terminal_shell_id: terminal_shell_id.clone(),
                        },
                    ))
                    .await
                    .unwrap();
            }
        });

        shell
    }
}

pub struct NativeShell {
    pty: Box<dyn Pty + Send + Sync>,
}

#[async_trait]
impl TerminalShell for NativeShell {
    async fn write(&self, data: String) {
        self.pty.write(&data).await.unwrap();
    }

    async fn resize(&self, cols: i32, rows: i32) {
        self.pty.resize((cols, rows)).await.unwrap();
    }
}
