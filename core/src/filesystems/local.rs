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
    /// Read a local file
    fn read_file_by_path(&self, path: &str) -> Result<String, Errors> {
        fs::read_to_string(path).map_err(|err| match err.kind() {
            ErrorKind::NotFound => Errors::Fs(FilesystemErrors::FileNotFound),
            _ => Errors::Fs(FilesystemErrors::FileNotFound),
        })
    }

    // List a local directory
    fn list_dir_by_path(&self, path: &str) -> Result<Vec<String>, Errors> {
        fs::read_dir(path)
            .map(|dirs| {
                dirs.filter_map(|entry| {
                    if let Ok(entry) = entry {
                        Some(entry.path().as_os_str().to_str().unwrap().to_string())
                    } else {
                        None
                    }
                })
                .collect::<Vec<String>>()
            })
            .map_err(|err| match err.kind() {
                ErrorKind::NotFound => Errors::Fs(FilesystemErrors::FileNotFound),
                _ => Errors::Fs(FilesystemErrors::FileNotFound),
            })
    }
}
