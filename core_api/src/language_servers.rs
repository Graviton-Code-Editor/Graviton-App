use async_trait::async_trait;
use serde::{Deserialize, Serialize};

#[async_trait]
pub trait LanguageServer {
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
    fn get_info(&self) -> LanguageServerBuilderInfo;

    fn build(&self) -> Box<dyn LanguageServer + Send + Sync>;
}
