use crate::filesystems::{DirItemInfo, FileInfo};
use crate::Errors;
use serde::{Deserialize, Serialize};

use super::ServerMessages;

/// Messages sent from the Client to the Server
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub enum ClientMessages {
    ListenToState {
        // The state ID
        state_id: u8,
    },
    NotifyExtension(NotifyExtension),
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
            Self::NotifyExtension(event, ..) => event.get_state_id(),
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
            Self::NotifyExtension(..) => "notifyExtension",
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

/// Messages use to notify the language server of certain events
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(tag = "msg_type")]
pub enum LanguageServerMessage {
    Notification {
        id: String,
        content: String,
        state_id: u8,
    },
}

impl LanguageServerMessage {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::Notification { state_id, .. } => *state_id,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(tag = "msg_type")]
pub enum UIEvent {
    StatusBarItemClicked { state_id: u8, id: String },
    CommandActioned { state_id: u8, id: String },
}

impl UIEvent {
    pub fn get_owner_id(&self) -> &str {
        match self {
            Self::CommandActioned { id, .. } => id,
            Self::StatusBarItemClicked { id, .. } => id,
        }
    }

    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::CommandActioned { state_id, .. } => *state_id,
            Self::StatusBarItemClicked { state_id, .. } => *state_id,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(tag = "msg_type")]
pub enum NotifyExtension {
    ExtensionMessage {
        state_id: u8,
        content: String,
        extension_id: String,
    },
}

impl NotifyExtension {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::ExtensionMessage { state_id, .. } => *state_id,
        }
    }

    pub fn get_extension_id(&self) -> String {
        match self {
            Self::ExtensionMessage { extension_id, .. } => extension_id.clone(),
        }
    }
}
