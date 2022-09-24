use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use tokio::fs::read_to_string;

/// Possible errors when trying to read a manifest file
#[derive(PartialEq, Eq, Debug)]
pub enum ManifestErrors {
    NotFound,
    CannotParse,
}

/// Represents the [extension] section
#[derive(Serialize, Deserialize, PartialEq, Eq, Clone, Debug, Default)]
pub struct ManifestExtension {
    pub name: String,
    pub id: String,
    pub author: String,
    pub version: String,
    pub repository: String,
    pub main: Option<String>,
}

/// Represents the whole TOML file
#[derive(Serialize, Deserialize, PartialEq, Eq, Clone, Debug, Default)]
pub struct ManifestInfo {
    pub extension: ManifestExtension,
}

#[derive(Deserialize, PartialEq, Eq, Clone, Debug)]
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
