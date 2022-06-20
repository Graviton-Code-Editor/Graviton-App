use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub enum ToExtension {
    LoadBranch { path: String },
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "msg_type")]
pub enum FromExtension {
    RepoNotFound { path: String },
    Branch { name: String, path: String },
}
