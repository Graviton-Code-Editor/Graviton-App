use serde::{Deserialize, Serialize};

use crate::filesystems::FileFormat;

/// Serialized Tab's data
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(tag = "tab_type")]
pub enum TabData {
    /// Text Editor tab
    TextEditor {
        path: String,
        filesystem: String,
        format: FileFormat,
        filename: String,
        id: String,
    },
    /// Basic tab (e.g. Settings)
    Basic { title: String, id: String },
}

#[derive(Serialize, Deserialize, Clone, Debug, Default, PartialEq, Eq)]
pub struct ViewDataPanel {
    /// Focused tab in the specific View panel
    selected_tab_id: Option<String>,
    /// Data from all the tabs in the View panel
    tabs: Vec<TabData>,
}

#[derive(Serialize, Deserialize, Clone, Debug, Default, PartialEq, Eq)]
pub struct ViewsData {
    /// All the View panels in the View
    view_panels: Vec<ViewDataPanel>,
}
