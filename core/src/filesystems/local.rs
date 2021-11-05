use crate::server::Errors;
use std::{
    fs,
    io::ErrorKind,
};

use super::{
    Filesystem,
    FilesystemErrors,
};

/// Implementation of FileSystem methods for a local access
pub struct LocalFilesystem;

impl LocalFilesystem {
    pub fn new() -> Self {
        Self
    }
}

impl Filesystem for LocalFilesystem {
    /// Read a file locally
    fn read_file_by_path(&self, path: &str) -> Result<String, Errors> {
        fs::read_to_string(path).map_err(|err| match err.kind() {
            ErrorKind::NotFound => Errors::Fs(FilesystemErrors::FileNotFound),
            _ => Errors::Fs(FilesystemErrors::FileNotFound),
        })
    }
}
