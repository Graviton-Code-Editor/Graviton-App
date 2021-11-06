use crate::server::Errors;
use serde::{
    Deserialize,
    Serialize,
};
mod local;
pub use local::LocalFilesystem;

#[derive(Serialize, Deserialize)]
pub enum FilesystemErrors {
    FilesystemNotFound,
    FileNotFound,
    FileNotSupported,
    PermissionDenied,
}

/// Filesystem interface
pub trait Filesystem {
    fn read_file_by_path(&self, path: &str) -> Result<String, Errors>;
    fn list_dir_by_path(&self, path: &str) -> Result<Vec<String>, Errors>;
}
