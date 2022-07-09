use async_trait::async_trait;
use gveditor_core_api::terminal_shells::TerminalShell;
use tokio::sync::mpsc::{unbounded_channel, UnboundedSender};

#[derive(Clone)]
struct DummyShell(UnboundedSender<String>);

#[async_trait]
impl TerminalShell for DummyShell {
    async fn write(&mut self, data: String) {
        self.0.send(data).ok();
    }

    async fn resize(&mut self, _cols: i32, _rows: i32) {
        todo!()
    }
}

#[tokio::test]
async fn terminal_shells() {
    let (in_writer, mut in_reader) = unbounded_channel::<String>();
    let (out_writer, mut out_reader) = unbounded_channel::<String>();

    let mut shell = DummyShell(in_writer);

    tokio::spawn(async move {
        while let Some(_msg) = in_reader.recv().await {
            out_writer.send("test".to_string()).unwrap();
        }
    });

    shell.write("Hello World".to_string()).await;

    let msg = out_reader.recv().await.unwrap();

    assert_eq!(msg, "test");
}
