use std::{collections::HashMap, io::Error, path::PathBuf};

use serde::{Deserialize, Serialize};
use tokio::fs;

pub struct ExtensionSettings {
    data: HashMap<String, String>,
    path: PathBuf,
}

// TODO(marc2332) This extension settings are private and not shared to the frontend,
// it would be very useful for extensions to have the ability to expose certain keys so the user can edit them
impl ExtensionSettings {
    pub async fn new(path: PathBuf) -> Self {
        let data = Self::load(&path).await;

        Self { data, path }
    }

    async fn load(path: &PathBuf) -> HashMap<String, String> {
        let file_content = fs::read_to_string(path).await;
        if let Ok(file_content) = file_content {
            serde_json::from_str(&file_content).unwrap_or_default()
        } else {
            HashMap::default()
        }
    }

    async fn save(&self) -> Result<(), Error> {
        let new_file_content = serde_json::to_string(&self.data);
        if let Ok(new_file_content) = new_file_content {
            fs::write(self.path.clone(), new_file_content).await
        } else {
            Ok(())
        }
    }

    /// Get a value from a key
    pub async fn get<'a, T>(&'a self, key: &str) -> Option<T>
    where
        T: Deserialize<'a>,
    {
        let value = self.data.get(key)?;
        serde_json::from_str(value).unwrap_or_default()
    }

    /// Set a key with a value
    pub async fn set<T>(&mut self, key: &str, value: T) -> Result<(), Error>
    where
        T: Serialize,
    {
        let value = serde_json::to_string(&value)?;
        self.data.insert(key.to_string(), value);
        self.save().await?;
        Ok(())
    }
}
