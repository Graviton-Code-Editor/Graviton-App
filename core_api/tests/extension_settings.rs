use std::env::current_dir;

use gveditor_core_api::extensions::settings::ExtensionSettings;
use tokio::fs;

#[tokio::test]
async fn create_settings() {
    let mut cwd = current_dir().unwrap();
    cwd.pop(); // Go back to the root of the project
    let target_path = cwd.join("target");
    let temp_file = target_path.join("tests");

    fs::remove_file(&temp_file).await.ok();

    let mut settings = ExtensionSettings::new(temp_file).await;

    let value: Option<String> = settings.get("hello_world").await;

    assert!(value.is_none());

    settings.set("hello_world", "graviton").await.unwrap();

    let value: Option<String> = settings.get("hello_world").await;

    assert_eq!(value, Some("graviton".to_string()));
}

#[tokio::test]
async fn read_settings() {
    let cwd = current_dir().unwrap();
    let target_path = cwd.join("target/ok_manifest.toml");
    let temp_file = target_path.join("tests");

    let settings = ExtensionSettings::new(temp_file).await;

    let value: Option<String> = settings.get("hello_world").await;

    assert!(value.is_none());
}
