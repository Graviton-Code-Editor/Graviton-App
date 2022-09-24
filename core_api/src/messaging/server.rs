use crate::states::StateData;
use serde::{Deserialize, Serialize};

/// Messages sent from the Server to the Client
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(tag = "msg_type")]
pub enum ServerMessages {
    MessageFromExtension {
        state_id: u8,
        extension_id: String,
        message: String,
    },
    ShowPopup {
        state_id: u8,
        popup_id: String,
        content: String,
        title: String,
    },
    ShowStatusBarItem {
        state_id: u8,
        id: String,
        label: String,
    },
    HideStatusBarItem {
        state_id: u8,
        id: String,
    },
    NotifyLanguageServersClient {
        state_id: u8,
        id: String,
        language: String,
        content: String,
    },
    StateUpdated {
        state_data: StateData,
    },
    TerminalShellUpdated {
        state_id: u8,
        terminal_shell_id: String,
        data: Vec<u8>,
    },
    RegisterCommand {
        state_id: u8,
        name: String,
        id: String,
    },
    UnloadedLanguageServer {
        id: String,
        state_id: u8,
    },
}

impl ServerMessages {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::UnloadedLanguageServer { state_id, .. } => *state_id,
            Self::RegisterCommand { state_id, .. } => *state_id,
            Self::TerminalShellUpdated { state_id, .. } => *state_id,
            Self::MessageFromExtension { state_id, .. } => *state_id,
            Self::StateUpdated { state_data } => state_data.id,
            Self::ShowPopup { state_id, .. } => *state_id,
            Self::ShowStatusBarItem { state_id, .. } => *state_id,
            Self::HideStatusBarItem { state_id, .. } => *state_id,
            Self::NotifyLanguageServersClient { state_id, .. } => *state_id,
        }
    }
}
