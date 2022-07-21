use std::io::{stdout, Write};

use crosspty::platforms::new_pty;
use tokio::sync::mpsc::channel;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = channel::<Vec<u8>>(1);
    let pty = new_pty("powershell", vec!["-noprofile"], tx);
    tokio::spawn(async move {
        loop {
            let cmd = "echo 'hello world' \x0D";

            for c in cmd.chars() {
                pty.write(&c.to_string()).await.unwrap();
            }
        }
    });

    loop {
        let res = rx.recv().await.unwrap();
        print!("{}", String::from_utf8_lossy(&res));
        stdout().flush().unwrap();
    }
}
