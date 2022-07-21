use std::{ffi::OsString, str::FromStr, sync::Arc};

use async_trait::async_trait;
use futures::executor::block_on;
use tokio::sync::mpsc::Sender;
use winptyrs::{AgentConfig, MouseMode, PTYArgs, PTYBackend, PTY};

use crate::Pty;

#[derive(Clone)]
pub struct PtyWin {
    pty: Arc<PTY>,
}

impl PtyWin {
    pub fn new(command: &str, _args: Vec<&str>, sender: Sender<Vec<u8>>) -> Self {
        let command = command.to_owned();

        let cmd = OsString::from(command);

        let pty_args = PTYArgs {
            cols: 80,
            rows: 25,
            mouse_mode: MouseMode::WINPTY_MOUSE_MODE_NONE,
            timeout: 10000,
            agent_config: AgentConfig::WINPTY_FLAG_COLOR_ESCAPES,
        };

        let mut pty = PTY::new_with_backend(&pty_args, PTYBackend::ConPTY).unwrap();

        pty.spawn(cmd, None, None, None).unwrap();

        let pty = Arc::new(pty);
        {
            let pty = pty.clone();
            tokio::task::spawn_blocking(move || {
                block_on(async move {
                    loop {
                        if sender.is_closed() {
                            break;
                        }
                        let output = pty.read(1000, true);
                        if let Ok(output) = output {
                            let res = sender
                                .send(output.to_string_lossy().as_bytes().to_vec())
                                .await;

                            if res.is_err() {
                                break;
                            }
                        }
                    }
                })
            });
        }

        Self { pty }
    }
}

#[async_trait]
impl Pty for PtyWin {
    async fn write(&self, data: &str) -> Result<(), String> {
        let pty = self.pty.clone();
        let data = OsString::from_str(&String::from_utf8_lossy(data.as_bytes())).unwrap();
        pty.write(data).ok();
        Ok(())
    }

    async fn resize(&self, (cols, rows): (i32, i32)) -> Result<(), String> {
        let pty = self.pty.clone();
        pty.set_size(cols, rows).unwrap();
        Ok(())
    }
}
