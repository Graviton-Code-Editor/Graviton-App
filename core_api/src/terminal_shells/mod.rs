use async_trait::async_trait;
use serde::{Deserialize, Serialize};

#[async_trait]
pub trait TerminalShell {
    // TODO(marc2332): Actually report errors
    async fn write(&self, data: String);

    async fn resize(&self, cols: u16, rows: u16);
}

#[derive(Serialize, Deserialize, Clone)]
pub struct TerminalShellBuilderInfo {
    pub id: String,
    pub name: String,
}

#[async_trait]
pub trait TerminalShellBuilder {
    fn get_info(&self) -> TerminalShellBuilderInfo;

    fn build(&self, terminal_shell_id: &str) -> Box<dyn TerminalShell + Send + Sync>;
}
