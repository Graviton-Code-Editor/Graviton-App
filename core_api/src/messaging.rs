use serde::{
    Deserialize,
    Serialize,
};

use crate::filesystems::{
    DirItemInfo,
    FileInfo,
};
use crate::state::StateData;
use crate::Errors;

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
}

impl Messages {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::ListenToState { state_id, .. } => *state_id,
            Self::StateUpdated { state_data } => state_data.id,
            Self::ShowPopup { state_id, .. } => *state_id,
            Self::ShowStatusBarItem { state_id, .. } => *state_id,
            Self::HideStatusBarItem { state_id, .. } => *state_id,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum ExtensionMessages {
    CoreMessage(Messages),
    ReadFile(u8, String, Result<FileInfo, Errors>),
    WriteFile(u8, String, String, Result<(), Errors>),
    ListDir(u8, String, String, Result<Vec<DirItemInfo>, Errors>),
}

impl ExtensionMessages {
    pub fn get_state_id(&self) -> u8 {
        match self {
            Self::CoreMessage(msg) => msg.get_state_id(),
            Self::ReadFile(state_id, ..) => *state_id,
            Self::WriteFile(state_id, ..) => *state_id,
            Self::ListDir(state_id, ..) => *state_id,
        }
    }
}
