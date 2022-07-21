use async_trait::async_trait;

pub mod platforms;

#[async_trait]
pub trait Pty {
    async fn write(&self, data: &str) -> Result<(), String>;
    async fn resize(&self, size: (i32, i32)) -> Result<(), String>;
}
