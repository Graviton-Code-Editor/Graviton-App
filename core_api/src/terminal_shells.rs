use async_trait::async_trait;
use serde::{Deserialize, Serialize};

#[async_trait]
pub trait TerminalShell {
    /// Write data into the terminal shell
    /// TODO(marc2332) This should return something like Result<(), T>
    async fn write(&self, data: String);

    /// Resize the shell with a new size
    async fn resize(&self, cols: i32, rows: i32);
}

#[derive(Serialize, Deserialize, Clone)]
pub struct TerminalShellBuilderInfo {
    pub id: String,
    pub name: String,
}

#[async_trait]
pub trait TerminalShellBuilder {
    /// Retrieve Info about the shell
    fn get_info(&self) -> TerminalShellBuilderInfo;

    /// Create an instance of the shell
    fn build(&self, terminal_shell_id: &str) -> Box<dyn TerminalShell + Send + Sync>;
}
