use async_trait::async_trait;

pub mod platforms;

#[async_trait]
pub trait Pty {
    async fn write(&self, data: &str) -> Result<(), String>;
    async fn resize(&self, size: (i32, i32)) -> Result<(), String>;
}

pub enum PtyErrors {}

#[cfg(test)]
mod tests {
    use tokio::sync::mpsc::channel;

    use crate::platforms::new_pty;

    #[tokio::test]
    async fn boots_up() {
        let (tx, mut rx) = channel::<Vec<u8>>(1);
        let _pty = new_pty("powershell", vec![], tx);
        let res = rx.recv().await.unwrap();
        let res = String::from_utf8_lossy(&res);
        assert!(res.contains("Windows PowerShell"));
        assert!(res.contains("https://aka.ms/PSWindows"));
    }
}
