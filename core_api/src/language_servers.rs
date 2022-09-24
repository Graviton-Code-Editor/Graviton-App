use async_trait::async_trait;
use serde::{Deserialize, Serialize};

#[async_trait]
pub trait LanguageServer {
    /// Write data to the Language Server
    async fn write(&mut self, data: String);
}

#[derive(Serialize, Deserialize, Clone)]
pub struct LanguageServerBuilderInfo {
    pub name: String,
    pub id: String,
    pub extension_id: String,
}

#[async_trait]
pub trait LanguageServerBuilder {
    /// Retrieve Info about the Language Server
    fn get_info(&self) -> LanguageServerBuilderInfo;

    /// Create an instance of the Language Server
    fn build(&self) -> Box<dyn LanguageServer + Send + Sync>;
}
