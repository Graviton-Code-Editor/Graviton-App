use serde::{Deserialize, Serialize};

use crate::filesystems::FileFormat;

/// A Tab data
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(tag = "tab_type")]
pub enum TabData {
    // Text Editor tab
    TextEditor {
        path: String,
        filesystem: String,
        format: FileFormat,
        filename: String,
        id: String,
    },
    // Basic tab (e.g. Settings)
    Basic {
        title: String,
        id: String,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct ViewDataPanel {
    selected_tab_id: Option<String>,
    tabs: Vec<TabData>,
}

#[derive(Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct ViewsData {
    view_panels: Vec<ViewDataPanel>,
}
