use std::path::PathBuf;

use serde_derive::Deserialize;
use tokio::fs::read_to_string;

/// Possible errors when trying to read a manifest file
pub enum ManifestErrors {
    NotFound,
    CannotParse,
}

/// Represents the [extension] section
#[derive(Deserialize, PartialEq, Eq)]
struct ManifestExtension {
    name: String,
    author: String,
    version: String,
    repository: String,
    main: String,
}

/// Represents the whole TOML file
#[derive(Deserialize, PartialEq, Eq)]
pub struct ManifestInfo {
    extension: ManifestExtension,
}

#[derive(Deserialize, PartialEq, Eq)]
pub struct Manifest {
    pub location: PathBuf,
    pub info: ManifestInfo,
}

impl Manifest {
    pub async fn parse(path: &PathBuf) -> Result<Self, ManifestErrors> {
        let manifest_content = read_to_string(&path)
            .await
            .map_err(|_| ManifestErrors::NotFound)?;

        if let Ok(info) = toml::from_str::<ManifestInfo>(&manifest_content) {
            Ok(Self {
                location: path.to_path_buf(),
                info,
            })
        } else {
            Err(ManifestErrors::CannotParse)
        }
    }
}
