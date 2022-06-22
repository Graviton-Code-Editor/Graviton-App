use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use self::{commands::CommandConfig, views::ViewsData};

pub mod commands;
pub mod views;

/// The data of a state
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct StateData {
    pub id: u8,
    // Views, ViewPanels, and Tabs
    pub views: Vec<ViewsData>,
    // Configured commands with their hotkeys
    pub commands: HashMap<String, CommandConfig>,
}

impl Default for StateData {
    fn default() -> Self {
        Self {
            id: 1,
            views: Vec::default(),
            commands: HashMap::default(),
        }
    }
}
