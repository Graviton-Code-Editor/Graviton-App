use gveditor_core_api::extensions::manager::ExtensionsManager;
use gveditor_core_api::messaging::ClientMessages;
use gveditor_core_api::ManifestInfo;
use gveditor_core_deno::DenoExtensionSupport;
use std::env::current_dir;
use tokio::sync::mpsc::channel;

/// Loads an extension entry file directly, and waits for a message sent from it
#[tokio::test]
async fn load_sample_extension() {
    let (sd, _) = channel::<ClientMessages>(1);
    let mut manager = ExtensionsManager::new(sd.clone(), None);

    let location = current_dir().unwrap().join("tests/js/sample_extension.js");

    manager.load_extension_with_deno(location.to_str().unwrap(), ManifestInfo::default(), 0);

    assert_eq!(manager.extensions.len(), 2);
}

/// Loads the extension located under tests/extensions, executes it, and waits for a message sent from it
#[tokio::test]
async fn load_extensions_from_folder() {
    let (sd, _) = channel::<ClientMessages>(1);
    let mut manager = ExtensionsManager::new(sd.clone(), None);

    let location = current_dir().unwrap().join("tests/js/extensions");
    let location = location.to_str().unwrap();

    manager
        .load_extensions_with_deno_in_directory(location, 0)
        .await;

    assert_eq!(manager.extensions.len(), 2);
}
