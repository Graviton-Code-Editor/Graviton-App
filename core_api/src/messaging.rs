use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::filesystems::{DirItemInfo, FileInfo};
use crate::state::StateData;
use crate::{Errors, LanguageServer};

/// Messages bidirectionally with the core
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(tag = "msg_type")]
pub enum ServerMessages {
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
    StateUpdated {
        state_data: StateData,
    },
}

impl ServerMessages {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::StateUpdated { state_data } => state_data.id,
            Self::ShowPopup { state_id, .. } => *state_id,
            Self::ShowStatusBarItem { state_id, .. } => *state_id,
            Self::HideStatusBarItem { state_id, .. } => *state_id,
            Self::RegisterLanguageServers { state_id, .. } => *state_id,
            Self::NotifyLanguageServersClient { state_id, .. } => *state_id,
        }
    }
}

/// Messages use to notify the language server of certain events
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(tag = "msg_type")]
pub enum LanguageServerMessage {
    Initialization {
        id: String,
        state_id: u8,
    },
    Notification {
        id: String,
        content: String,
        state_id: u8,
    },
}

impl LanguageServerMessage {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::Initialization { state_id, .. } => *state_id,
            Self::Notification { state_id, .. } => *state_id,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(tag = "msg_type")]
pub enum UIEvent {
    StatusBarItemClicked { state_id: u8, id: String },
}

impl UIEvent {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::StatusBarItemClicked { state_id, .. } => *state_id,
        }
    }
}

/// Messages use to notify the extensions of certain events
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum ClientMessages {
    // When a frontend listens for changes in a particular state
    // The core will sent the current state for it's particular ID if there is anyone
    // If not, a default state will be sent
    ListenToState {
        // The state ID
        state_id: u8,
    },
    NotifyLanguageServers(LanguageServerMessage),
    ServerMessage(ServerMessages),
    UIEvent(UIEvent),
    ReadFile(u8, String, Result<FileInfo, Errors>),
    WriteFile(u8, String, String, Result<(), Errors>),
    ListDir(u8, String, String, Result<Vec<DirItemInfo>, Errors>),
    Unload(u8),
}

impl ClientMessages {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::ServerMessage(msg) => msg.get_state_id(),
            Self::ListenToState { state_id, .. } => *state_id,
            Self::ReadFile(state_id, ..) => *state_id,
            Self::WriteFile(state_id, ..) => *state_id,
            Self::ListDir(state_id, ..) => *state_id,
            Self::Unload(state_id, ..) => *state_id,
            Self::UIEvent(event) => event.get_state_id(),
            Self::NotifyLanguageServers(msg) => msg.get_state_id(),
        }
    }

    pub fn get_name(&self) -> &str {
        match self {
            Self::ServerMessage(..) => "serverMessage",
            Self::ListenToState { .. } => "listenToState",
            Self::ReadFile(..) => "readFile",
            Self::WriteFile(..) => "writeFile",
            Self::ListDir(..) => "listDir",
            Self::Unload(..) => "unload",
            Self::UIEvent(..) => "ui",
            Self::NotifyLanguageServers { .. } => "lsp",
        }
    }
}
