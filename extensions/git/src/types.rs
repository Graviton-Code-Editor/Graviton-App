use serde::{Deserialize, Serialize};

// Messages sent from the client to the extension

#[derive(Serialize, Deserialize)]
pub enum ToExtension {
    LoadBranch { path: String },
    LoadFilesStates { path: String },
}

// Messages sent from the extension to the client

#[derive(Serialize, Deserialize)]
#[serde(tag = "msg_type")]
pub enum FromExtension {
    RepoNotFound {
        path: String,
    },
    Branch {
        name: String,
        path: String,
    },
    FilesState {
        path: String,
        files_states: Vec<FileState>,
    },
}

#[derive(Serialize, Deserialize)]
pub struct FileState {
    pub path: String,
    pub status: u32,
}
