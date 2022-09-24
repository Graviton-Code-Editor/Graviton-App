use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use std::path::Path;
mod local;
pub use local::LocalFilesystem;

use crate::Errors;

/// Filesystem errors
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub enum FilesystemErrors {
    FilesystemNotFound,
    FileNotFound,
    FileNotSupported,
    PermissionDenied,
}

/// Filesystem interface
#[async_trait]
pub trait Filesystem {
    async fn read_file_by_path(&self, path: &str) -> Result<FileInfo, Errors>;
    async fn write_file_by_path(&self, path: &str, content: &str) -> Result<(), Errors>;
    async fn list_dir_by_path(&self, path: &str) -> Result<Vec<DirItemInfo>, Errors>;
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub struct DirItemInfo {
    pub path: String,
    pub name: String,
    pub is_file: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub enum FileFormat {
    Unknown,
    Binary,
    Text(String),
}

/// Returns the content format of the give file
///
/// # Arguments
///
/// * `path`   - The path of the file
///
pub fn get_format_from_path(path: &str) -> FileFormat {
    if let Some(ext) = Path::new(path).extension() {
        match ext.to_str().unwrap() {
            // HTML
            "html" => FileFormat::Text("HTML".to_string()),
            // CSS
            "css" => FileFormat::Text("CSS".to_string()),
            // Rust
            "rs" => FileFormat::Text("Rust".to_string()),
            // Javascript
            "js" => FileFormat::Text("JavaScript".to_string()),
            "jsx" => FileFormat::Text("JavaScript".to_string()),
            // TypeScript
            "ts" => FileFormat::Text("TypeScript".to_string()),
            "tsx" => FileFormat::Text("TypeScript".to_string()),
            // PHP
            "php" => FileFormat::Text("PHP".to_string()),
            // Python
            "py" => FileFormat::Text("Python".to_string()),
            // Not identified
            "md" => FileFormat::Text("Markdown".to_string()),
            // Not identified
            _ => FileFormat::Unknown,
        }
    } else {
        FileFormat::Unknown
    }
}

/// Contains information about a file
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub struct FileInfo {
    pub content: String,
    pub format: FileFormat,
    pub path: String,
}

impl FileInfo {
    pub fn new(path: &str, content: String) -> Self {
        Self {
            content,
            format: get_format_from_path(path),
            path: path.to_owned(),
        }
    }
}
