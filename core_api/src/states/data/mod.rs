use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use self::{commands::CommandConfig, views::ViewsData};

pub mod commands;
pub mod views;

/// The configuration of a State
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct StateData {
    /// Identification for the State
    pub id: u8,
    /// Views, ViewPanels, and Tabs
    pub views: Vec<ViewsData>,
    /// Commands with their hotkeys
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
