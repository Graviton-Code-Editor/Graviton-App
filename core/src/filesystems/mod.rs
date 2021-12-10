use crate::server::Errors;
use serde::{
    Deserialize,
    Serialize,
};
use std::path::Path;
mod local;
pub use local::LocalFilesystem;

#[derive(Serialize, Deserialize, Debug)]
pub enum FilesystemErrors {
    FilesystemNotFound,
    FileNotFound,
    FileNotSupported,
    PermissionDenied,
}

/// Filesystem interface
pub trait Filesystem {
    fn read_file_by_path(&self, path: &str) -> Result<FileInfo, Errors>;
    fn list_dir_by_path(&self, path: &str) -> Result<Vec<DirItemInfo>, Errors>;
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DirItemInfo {
    path: String,
    name: String,
    is_file: bool,
}

#[derive(Serialize, Deserialize, Debug)]
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
            "rs" => FileFormat::Text("Rust".to_string()),
            _ => FileFormat::Unknown,
        }
    } else {
        FileFormat::Unknown
    }
}

/// Contains information about a file
#[derive(Serialize, Deserialize, Debug)]
pub struct FileInfo {
    content: String,
    format: FileFormat,
}

impl FileInfo {
    pub fn new(path: &str, content: String) -> Self {
        Self {
            content,
            format: get_format_from_path(path),
        }
    }
}
