use crate::{states::StateData, LanguageServer};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Messages sent from the Server to the Client
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
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
    RegisterLanguageServers {
        state_id: u8,
        languages: HashMap<String, LanguageServer>,
        extension_id: String,
    },
    NotifyLanguageServersClient {
        state_id: u8,
        language: String,
        content: String,
    },
    StateUpdated {
        state_data: StateData,
    },
}

impl ServerMessages {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::MessageFromExtension { state_id, .. } => *state_id,
            Self::StateUpdated { state_data } => state_data.id,
            Self::ShowPopup { state_id, .. } => *state_id,
            Self::ShowStatusBarItem { state_id, .. } => *state_id,
            Self::HideStatusBarItem { state_id, .. } => *state_id,
            Self::RegisterLanguageServers { state_id, .. } => *state_id,
            Self::NotifyLanguageServersClient { state_id, .. } => *state_id,
        }
    }
}
