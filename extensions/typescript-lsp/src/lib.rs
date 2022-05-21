use gveditor_core_api::extensions::base::{Extension, ExtensionInfo};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::messaging::{ClientMessages, LanguageServerMessage, ServerMessages};
use gveditor_core_api::tokio::io::{AsyncBufReadExt, AsyncReadExt, AsyncWriteExt, BufReader};
use gveditor_core_api::tokio::process::Command;
use gveditor_core_api::tokio::sync::mpsc::{channel, Receiver};
use gveditor_core_api::{tokio, LanguageServer, ManifestExtension, ManifestInfo, Sender};
use std::collections::HashMap;
use std::process::Stdio;

static EXTENSION_NAME: &str = "TypeScript/JavaScript Intellisense";

#[cfg(windows)]
pub const NPX_BINARY: &str = "npx.cmd";

#[cfg(not(windows))]
pub const NPX_BINARY: &str = "npx";

struct TSLSPExtension {
    client: ExtensionClient,
    state_id: u8,
    rx: Option<Receiver<ClientMessages>>,
    tx: Sender<ClientMessages>,
}

impl Extension for TSLSPExtension {
    fn get_info(&self) -> ExtensionInfo {
        ExtensionInfo {
            id: env!("CARGO_PKG_NAME").to_string(),
            name: EXTENSION_NAME.to_string(),
        }
    }

    fn init(&mut self) {
        let client = self.client.clone();
        let state_id = self.state_id;

        let (lsp_tx, mut lsp_rx) = channel::<LanguageServerMessage>(20);

        let ls_client = client.clone();

        tokio::spawn(async move {
            if let Some(LanguageServerMessage::Initialization { .. }) = lsp_rx.recv().await {
                let mut proc = Command::new(NPX_BINARY)
                    .arg("typescript-language-server")
                    .arg("--stdio")
                    .stdin(Stdio::piped())
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn()
                    .unwrap();

                let mut stdin = proc.stdin.take().unwrap();
                let stdout = proc.stdout.take().unwrap();
                let mut child_out = BufReader::new(stdout);

                // Read the stdout of the language server process and parse the messages
                // Note(marc2332): To be honest, I had to look at how rust-analyzer did it.
                tokio::spawn(async move {
                    loop {
                        let mut size = None;
                        let mut buffer = String::new();
                        loop {
                            buffer.clear();
                            if child_out.read_line(&mut buffer).await.unwrap() == 0 {
                                break;
                            }
                            if !buffer.ends_with("\r\n") {
                                break;
                            }
                            let buf = &buffer[..buffer.len() - 2];
                            if buf.is_empty() {
                                break;
                            }
                            let mut parts = buf.splitn(2, ": ");
                            let header_name = parts.next().unwrap();
                            let header_value = parts.next().unwrap();
                            if header_name == "Content-Length" {
                                size = Some(header_value.parse::<usize>().unwrap());
                            }
                        }

                        if let Some(size) = size {
                            tracing::info!("(ts-lsp) Received {size} bytes");

                            let mut message = buffer.into_bytes();
                            message.resize(size, 0);
                            child_out.read_exact(&mut message).await.unwrap();

                            let message = String::from_utf8(message).unwrap();

                            // Send the message to the LSP Client
                            ls_client
                                .send(ClientMessages::ServerMessage(
                                    ServerMessages::NotifyLanguageServersClient {
                                        state_id,
                                        content: message.clone(),
                                    },
                                ))
                                .await
                                .unwrap();
                        }
                    }
                });

                // Wait for any notification from the LSP Client and then write it in the language server stdin
                loop {
                    if let Some(LanguageServerMessage::Notification { content, .. }) =
                        lsp_rx.recv().await
                    {
                        let content = snailquote::unescape(&content).unwrap();
                        let content =
                            format!("Content-Length: {}\r\n\r\n{}", content.len(), content);
                        let content = content.as_bytes();

                        tracing::info!("(ts-lsp) Sent {} bytes", content.len());

                        stdin.write_all(content).await.unwrap();
                    }
                }
            }
        });

        let receiver = self.rx.take();

        if let Some(mut receiver) = receiver {
            // Register the language server and wait for initialization
            tokio::spawn(async move {
                let mut languages = HashMap::new();

                languages.insert(
                    "TypeScript".to_string(),
                    LanguageServer {
                        name: "TypeScript".to_string(),
                        id: "typescript".to_string(),
                        extension_id: env!("CARGO_PKG_NAME").to_string(),
                    },
                );

                client
                    .register_language_server(state_id, languages)
                    .await
                    .unwrap();

                loop {
                    if let Some(ClientMessages::NotifyLanguageServers(message)) =
                        receiver.recv().await
                    {
                        lsp_tx.send(message).await.unwrap();
                    }
                }
            });
        }
    }

    fn unload(&mut self) {}

    fn notify(&mut self, message: ClientMessages) {
        let tx = self.tx.clone();
        tokio::spawn(async move {
            tx.send(message).await.unwrap();
        });
    }
}

pub fn entry(extensions: &mut ExtensionsManager, client: ExtensionClient, state_id: u8) {
    let (tx, rx) = channel::<ClientMessages>(20);
    let plugin = Box::new(TSLSPExtension {
        client,
        state_id,
        rx: Some(rx),
        tx,
    });
    let parent_id = env!("CARGO_PKG_NAME");
    extensions.register(parent_id, plugin);
}

pub fn get_info() -> ManifestInfo {
    ManifestInfo {
        extension: ManifestExtension {
            id: env!("CARGO_PKG_NAME").to_string(),
            name: EXTENSION_NAME.to_string(),
            author: "Marc Espín".to_string(),
            version: env!("CARGO_PKG_VERSION").to_string(),
            repository: "https://github.com/Graviton-Code-Editor/Graviton-App".to_string(),
            main: None,
        },
    }
}
