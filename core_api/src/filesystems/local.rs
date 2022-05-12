use async_trait::async_trait;
use tokio::fs;
use tokio_stream::wrappers::ReadDirStream;
use tokio_stream::StreamExt;

use crate::Errors;

use super::{DirItemInfo, FileInfo, Filesystem, FilesystemErrors};
use std::io::ErrorKind;

/// Implementation of FileSystem methods for a local access
#[derive(Default)]
pub struct LocalFilesystem;

impl LocalFilesystem {
    pub fn new() -> Self {
        Self
    }
}

#[async_trait]
impl Filesystem for LocalFilesystem {
    /// Read a local file
    async fn read_file_by_path(&self, path: &str) -> Result<FileInfo, Errors> {
        fs::read_to_string(path)
            .await
            .map(|content| FileInfo::new(path, content))
            .map_err(|err| match err.kind() {
                ErrorKind::NotFound => Errors::Fs(FilesystemErrors::FileNotFound),
                _ => Errors::Fs(FilesystemErrors::FileNotFound),
            })
    }

    /// Write a local file
    async fn write_file_by_path(&self, path: &str, content: &str) -> Result<(), Errors> {
        fs::write(path, content)
            .await
            .map_err(|err| match err.kind() {
                ErrorKind::NotFound => Errors::Fs(FilesystemErrors::FileNotFound),
                _ => Errors::Fs(FilesystemErrors::FileNotFound),
            })
    }

    // List a local directory
    async fn list_dir_by_path(&self, path: &str) -> Result<Vec<DirItemInfo>, Errors> {
        let dirs = fs::read_dir(path).await;

        if let Ok(dirs) = dirs {
            let mut result = Vec::new();
            let mut items = ReadDirStream::new(dirs);

            // Iterate over all the found extensions
            while let Some(Ok(item)) = items.next().await {
                let path = item.path();
                let str_path = path.as_os_str().to_str().unwrap().to_string();
                let item_name = path.file_name().unwrap().to_str().unwrap().to_string();
                let is_file = path.is_file();
                result.push(DirItemInfo {
                    path: str_path,
                    name: item_name,
                    is_file,
                });
            }

            result.sort_by_key(|item| item.is_file);

            Ok(result)
        } else {
            let err = dirs.unwrap_err();
            Err(match err.kind() {
                ErrorKind::NotFound => Errors::Fs(FilesystemErrors::FileNotFound),
                _ => Errors::Fs(FilesystemErrors::FileNotFound),
            })
        }
    }
}

#[cfg(test)]
mod tests {

    use super::{Filesystem, LocalFilesystem};

    #[tokio::test]
    async fn read_files() {
        let fs = LocalFilesystem::new();

        let file_exists = fs.read_file_by_path("../readme.md").await.is_ok();
        let doesnt_exist = fs.read_file_by_path("rust_>_*").await.is_err();

        assert!(file_exists);
        assert!(doesnt_exist);
    }

    #[tokio::test]
    async fn list_dir() {
        let fs = LocalFilesystem::new();

        let items_in_dir = fs.list_dir_by_path(".").await;

        assert!(items_in_dir.is_ok());

        let items_in_dir = items_in_dir.unwrap();

        assert!(items_in_dir.len() > 1);

        assert!(!items_in_dir[0].is_file);
    }
}
