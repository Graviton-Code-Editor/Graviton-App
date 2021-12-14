use super::{
    DirItemInfo,
    FileInfo,
    Filesystem,
    FilesystemErrors,
};
use crate::server::Errors;
use std::{
    fs,
    io::ErrorKind,
};

/// Implementation of FileSystem methods for a local access
#[derive(Default)]
pub struct LocalFilesystem;

impl LocalFilesystem {
    pub fn new() -> Self {
        Self
    }
}

impl Filesystem for LocalFilesystem {
    /// Read a local file
    fn read_file_by_path(&self, path: &str) -> Result<FileInfo, Errors> {
        fs::read_to_string(path)
            .map(|content| FileInfo::new(path, content))
            .map_err(|err| match err.kind() {
                ErrorKind::NotFound => Errors::Fs(FilesystemErrors::FileNotFound),
                _ => Errors::Fs(FilesystemErrors::FileNotFound),
            })
    }

    // List a local directory
    fn list_dir_by_path(&self, path: &str) -> Result<Vec<DirItemInfo>, Errors> {
        fs::read_dir(path)
            .map(|dirs| {
                let mut items = dirs
                    .filter_map(|entry| {
                        if let Ok(entry) = entry {
                            let path = entry.path();
                            let str_path = path.as_os_str().to_str().unwrap().to_string();
                            let item_name = path.file_name().unwrap().to_str().unwrap().to_string();
                            let is_file = path.is_file();
                            Some(DirItemInfo {
                                path: str_path,
                                name: item_name,
                                is_file,
                            })
                        } else {
                            None
                        }
                    })
                    .collect::<Vec<DirItemInfo>>();

                items.sort_by_key(|item| item.is_file);

                items
            })
            .map_err(|err| match err.kind() {
                ErrorKind::NotFound => Errors::Fs(FilesystemErrors::FileNotFound),
                _ => Errors::Fs(FilesystemErrors::FileNotFound),
            })
    }
}

#[cfg(test)]
mod tests {

    use super::{
        Filesystem,
        LocalFilesystem,
    };

    #[test]
    fn read_files() {
        let fs = LocalFilesystem::new();

        let file_exists = fs.read_file_by_path("../readme.md").is_ok();
        let doesnt_exist = !fs.read_file_by_path("rust_>_*").is_ok();

        assert!(file_exists);
        assert!(doesnt_exist);
    }

    #[test]
    fn list_dir() {
        let fs = LocalFilesystem::new();

        let items_in_dir = fs.list_dir_by_path(".");

        assert!(items_in_dir.is_ok());

        let items_in_dir = items_in_dir.unwrap();

        assert!(items_in_dir.len() > 1);

        assert!(!items_in_dir[0].is_file);
    }
}
