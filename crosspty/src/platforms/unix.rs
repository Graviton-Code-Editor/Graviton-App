use async_trait::async_trait;

use crate::Pty;

pub struct PtyUnix {}

impl PtyUnix {
    pub fn new() -> Self {
        Self {}
    }
}

#[async_trait]
impl Pty for PtyUnix {
    async fn write(&self, _data: &str) -> Result<(), String> {
        Ok(())
    }

    async fn resize(&self, (_cols, _rows): (i32, i32)) -> Result<(), String> {
        Ok(())
    }
}
