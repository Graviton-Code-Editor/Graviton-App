use std::process::Stdio;

use async_trait::async_trait;
use gveditor_core_api::{
    extensions::client::ExtensionClient,
    language_servers::{LanguageServerBuilder, LanguageServerBuilderInfo},
    messaging::{ClientMessages, ServerMessages},
    tokio::{
        self,
        io::{AsyncBufReadExt, AsyncReadExt, AsyncWriteExt, BufReader},
        process::{ChildStdin, Command},
    },
    LanguageServer,
};

use crate::EXTENSION_NAME;

#[cfg(windows)]
pub const NPX_BINARY: &str = "npx.cmd";

#[cfg(not(windows))]
pub const NPX_BINARY: &str = "npx";

pub struct JSTSLanguageServerBuilder {
    pub client: ExtensionClient,
    pub state_id: u8,
}

impl LanguageServerBuilder for JSTSLanguageServerBuilder {
    fn get_info(&self) -> LanguageServerBuilderInfo {
        LanguageServerBuilderInfo {
            id: "typescript".to_string(),
            name: EXTENSION_NAME.to_string(),
            extension_id: "js_ts_language_server".to_string(),
        }
    }

    fn build(&self) -> Box<dyn LanguageServer + Send + Sync> {
        let ls_client = self.client.clone();
        let state_id = self.state_id;
        let mut proc = Command::new(NPX_BINARY)
            .arg("typescript-language-server")
            .arg("--stdio")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .unwrap();

        let stdin = proc.stdin.take().unwrap();
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
                    let (header_name, header_value) = buf.split_once(": ").unwrap();
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
                                id: "typescript".to_string(),
                                language: "typescript".to_string(),
                                content: message.clone(),
                            },
                        ))
                        .await
                        .unwrap();
                }
            }
        });

        Box::new(JSTSLanguageServer { stdin })
    }
}

pub struct JSTSLanguageServer {
    stdin: ChildStdin,
}

#[async_trait]
impl LanguageServer for JSTSLanguageServer {
    async fn write(&mut self, data: String) {
        let stdin = &mut self.stdin;

        let content = snailquote::unescape(&data).unwrap();
        let content = format!("Content-Length: {}\r\n\r\n{}", content.len(), content);
        let content = content.as_bytes();

        tracing::info!("(ts-lsp) Sent {} bytes", content.len());

        stdin.write_all(content).await.unwrap();
    }
}
