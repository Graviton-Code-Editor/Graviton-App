use std::io::BufReader;
use std::sync::Arc;

use async_trait::async_trait;
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::messaging::{ClientMessages, ServerMessages};
use gveditor_core_api::terminal_shells::{
    TerminalShell, TerminalShellBuilder, TerminalShellBuilderInfo,
};
use gveditor_core_api::{tokio, Mutex};
use portable_pty::{CommandBuilder, NativePtySystem, PtyPair, PtySize, PtySystem};
use utf8_chars::BufReadCharsExt;

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

        // Use the native pty implementation for the system
        let pty_system = NativePtySystem::default();

        // Create a new pty
        let pair = pty_system
            .openpty(PtySize {
                rows: 24,
                cols: 80,
                pixel_width: 0,
                pixel_height: 0,
            })
            .unwrap();

        // Spawn a shell into the pty
        let cmd = CommandBuilder::new(&self.command);
        pair.slave.spawn_command(cmd).unwrap();

        // Read and parse output from the pty with reader
        let pty_reader = pair.master.try_clone_reader().unwrap();

        // Send data to the pty by writing to the master

        let shell = Box::new(NativeShell {
            pair: Arc::new(Mutex::new(pair)),
        });

        tokio::spawn(async move {
            tokio::task::spawn_blocking(move || {
                let mut r = BufReader::new(pty_reader);
                let mut r = r.chars();

                while let Some(Ok(data)) = r.next() {
                    let client = client.clone();
                    let terminal_shell_id = terminal_shell_id.clone();
                    println!("{}", data); // TODO(marc2332): This is very tricky...
                    tokio::spawn(async move {
                        client
                            .send(ClientMessages::ServerMessage(
                                ServerMessages::TerminalShellUpdated {
                                    data: data.to_string(),
                                    state_id,
                                    terminal_shell_id: terminal_shell_id.clone(),
                                },
                            ))
                            .await
                            .unwrap();
                    });
                }
            })
            .await
            .ok();
        });

        shell
    }
}

pub struct NativeShell {
    pair: Arc<Mutex<PtyPair>>,
}

#[async_trait]
impl TerminalShell for NativeShell {
    async fn write(&self, data: String) {
        write!(self.pair.lock().await.master, "{}", data).unwrap();
    }

    async fn resize(&self, cols: u16, rows: u16) {
        self.pair
            .lock()
            .await
            .master
            .resize(PtySize {
                cols,
                rows,
                pixel_width: 0,
                pixel_height: 0,
            })
            .unwrap();
    }
}
