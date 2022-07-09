use std::{ffi::OsString, io::{Read, BufReader, BufRead}, sync::{Arc}, time::Duration, str::FromStr};

use async_trait::async_trait;
use conpty::{io::PipeWriter, Process};
use fragile::Fragile;
use futures::executor::block_on;
use tokio::{sync::{mpsc::{Sender, channel, unbounded_channel, UnboundedSender}, Mutex}, time::sleep};
use winptyrs::{AgentConfig, MouseMode, PTYArgs, PTYBackend, PTY};
use std::io::Write;

use crate::Pty;

#[derive(Clone)]
pub struct PtyWin {
    tx: UnboundedSender<PtyWinMsg>
}

#[derive(Debug)]
enum PtyWinMsg {
    Write(String),
    Resize(i32, i32)
}

impl PtyWin {
    pub fn new(command: &str, args: Vec<&str>, sender: Sender<Vec<u8>>) -> Self {
        let (tx, mut rx) = unbounded_channel::<PtyWinMsg>();
        let command = command.to_owned(); 

        let cmd = OsString::from("cmd");
        let pty_args = PTYArgs {
            cols: 80,
            rows: 25,
            mouse_mode: MouseMode::WINPTY_MOUSE_MODE_NONE,
            timeout: 10000,
            agent_config: AgentConfig::WINPTY_FLAG_COLOR_ESCAPES
        };

        let mut pty = PTY::new_with_backend(&pty_args, PTYBackend::ConPTY).unwrap();

        pty.spawn(cmd, None, None, None).unwrap();

        let pty = Arc::new(Mutex::new(pty));
        

        // TODO(marc2332): Create the process in another thread
        {
            let pty = pty.clone();
        tokio::task::spawn_blocking(move || {
            block_on(async move {
                loop {
                    let output = pty.lock().await.read(128, false);
                    if let Ok(output) = output {
                        if !output.is_empty() {
                            sender.send(output.to_string_lossy().as_bytes().to_vec()).await.unwrap();
                        }
                    }
                }
            })       
        });
        }


        tokio::spawn(async move {
            while let Some(msg) = rx.recv().await {
                match msg {
                    PtyWinMsg::Write(data) => {
                        pty.lock().await.write(OsString::from_str(&String::from_utf8_lossy(data.as_bytes())).unwrap()).ok();
                        println!("WRITING... {}", data);
                    }
                    PtyWinMsg::Resize(cols, rows) => {
                        println!("RESIZING... {}|{}", cols, rows);
                        pty.lock().await.set_size(cols.try_into().unwrap(), rows.try_into().unwrap()).unwrap();
                    }
                }
            }            
        });

        

        Self { tx }
    }
}

#[async_trait]
impl Pty for PtyWin {
    async fn write(&mut self, data: &str) -> std::io::Result<usize> {
        self.tx.send(PtyWinMsg::Write(data.to_string())).unwrap();
        Ok(1)
    }

    async fn resize(&mut self, (cols, rows): (i32, i32)) -> Result<(), String> {
        println!("RESIZE?");
        self.tx.send(PtyWinMsg::Resize(cols, rows)).unwrap();
            Ok(())
    }
}

/*

    use std::{ffi::OsString, io::{Read, BufReader, BufRead}, sync::{Arc, Mutex}, time::Duration};

use async_trait::async_trait;
use conpty::{io::PipeWriter, Process};
use fragile::Fragile;
use futures::executor::block_on;
use tokio::{sync::{mpsc::{Sender, channel, unbounded_channel, UnboundedSender}}, time::sleep};
use winptyrs::{AgentConfig, MouseMode, PTYArgs, PTYBackend, PTY};
use std::io::Write;

use crate::Pty;

#[derive(Clone)]
pub struct PtyWin {
    tx: UnboundedSender<PtyWinMsg>
}

#[derive(Debug)]
enum PtyWinMsg {
    Write(String),
    Resize(i32, i32)
}

impl PtyWin {
    pub fn new(command: &str, args: Vec<&str>, sender: Sender<Vec<u8>>) -> Self {
        let (tx, mut rx) = unbounded_channel::<PtyWinMsg>();
        let command = command.to_owned(); 
        

        // TODO(marc2332): Create the process in another thread

        tokio::task::spawn_blocking(move || {
            let proc = conpty::spawn(command).unwrap();
            let mut writer = proc.input().unwrap();
            let reader = proc.output().unwrap();
            let  r = BufReader::new(reader);

            tokio::spawn(async move {
                for a in r.bytes() {
                    sender.send(vec![a.unwrap()]).await.unwrap();
                }         
            });

            while let Some(msg) = block_on(rx.recv()) {
                match msg {
                    PtyWinMsg::Write(data) => {
                        writer.write(data.as_bytes()).ok();
                        println!("WRITING... {}", data);
                    }
                    PtyWinMsg::Resize(cols, rows) => {
                        println!("RESIZING... {}|{}", cols, rows);
                        proc.resize(cols.try_into().unwrap(), rows.try_into().unwrap()).unwrap();
                    }
                }
            }
        });

        

        Self { tx }
    }
}

#[async_trait]
impl Pty for PtyWin {
    async fn write(&mut self, data: &str) -> std::io::Result<usize> {
        self.tx.send(PtyWinMsg::Write(data.to_string())).unwrap();
        Ok(1)
    }

    async fn resize(&mut self, (cols, rows): (i32, i32)) -> Result<(), String> {
        println!("RESIZE?");
        self.tx.send(PtyWinMsg::Resize(cols, rows)).unwrap();
            Ok(())
    }
}

*/