use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::filesystems::{DirItemInfo, FileInfo};
use crate::state::StateData;
use crate::{Errors, LanguageServer};

/// Messages bidirectionally with the core
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "msg_type")]
pub enum Messages {
    // When a frontend listens for changes in a particular state
    // The core will sent the current state for it's particular ID if there is anyone
    // If not, a default state will be sent
    ListenToState {
        // The message author, Core | Client
        trigger: String,
        // The state ID
        state_id: u8,
    },
    StateUpdated {
        state_data: StateData,
    },
    ShowPopup {
        state_id: u8,
        popup_id: String,
        content: String,
        title: String,
    },
    ShowStatusBarItem {
        state_id: u8,
        statusbar_item_id: String,
        label: String,
    },
    HideStatusBarItem {
        state_id: u8,
        statusbar_item_id: String,
    },
    RegisterLanguageServers {
        state_id: u8,
        languages: HashMap<String, LanguageServer>,
        extension_id: String,
    },
    NotifyLanguageServersClient {
        state_id: u8,
        content: String,
    },
    NotifyLanguageServers {
        state_id: u8,
        message: LanguageServerMessage,
    },
}

impl Messages {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::ListenToState { state_id, .. } => *state_id,
            Self::StateUpdated { state_data } => state_data.id,
            Self::ShowPopup { state_id, .. } => *state_id,
            Self::ShowStatusBarItem { state_id, .. } => *state_id,
            Self::HideStatusBarItem { state_id, .. } => *state_id,
            Self::RegisterLanguageServers { state_id, .. } => *state_id,
            Self::NotifyLanguageServersClient { state_id, .. } => *state_id,
            Self::NotifyLanguageServers { state_id, .. } => *state_id,
        }
    }
}

/// Messages use to notify the language server of certain events
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "msg_type")]
pub enum LanguageServerMessage {
    Initialization { id: String },
    Notification { id: String, content: String },
}

/// Messages use to notify the extensions of certain events
#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum ExtensionMessages {
    // TODO(marc2332): Don't use tuples
    CoreMessage(Messages),
    ReadFile(u8, String, Result<FileInfo, Errors>),
    WriteFile(u8, String, String, Result<(), Errors>),
    ListDir(u8, String, String, Result<Vec<DirItemInfo>, Errors>),
    Unload(u8),
}

impl ExtensionMessages {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::CoreMessage(msg) => msg.get_state_id(),
            Self::ReadFile(state_id, ..) => *state_id,
            Self::WriteFile(state_id, ..) => *state_id,
            Self::ListDir(state_id, ..) => *state_id,
            Self::Unload(state_id, ..) => *state_id,
        }
    }

    pub fn get_name(&self) -> &str {
        match self {
            Self::CoreMessage(..) => "core",
            Self::ReadFile(..) => "readFile",
            Self::WriteFile(..) => "writeFile",
            Self::ListDir(..) => "listDir",
            Self::Unload(..) => "unload",
        }
    }
}
