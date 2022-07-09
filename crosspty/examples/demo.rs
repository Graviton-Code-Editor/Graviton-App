use std::{
    io::{stdout, Write},
    time::Duration,
};

use crosspty::platforms::new_pty;
use tokio::{sync::mpsc::channel, time::sleep};

#[tokio::main]
async fn main() {
    let (tx, mut rx) = channel::<Vec<u8>>(1);
    let mut pty = new_pty("powershell", vec!["-noprofile"], tx);
    tokio::spawn(async move {
        loop {
            sleep(Duration::from_millis(100)).await;
            pty.write("echo 'hello world' \x0D").await.unwrap();
        }
    });

    loop {
        let res = rx.recv().await.unwrap();
        print!("{}", String::from_utf8_lossy(&res));
        stdout().flush().unwrap();
    }
}
