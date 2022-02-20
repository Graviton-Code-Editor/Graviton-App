use std::env::current_dir;

use core_deno::DenoExtensionSupport;
use gveditor_core_api::extensions::manager::{
    ExtensionsManager,
    LoadedExtension,
};
use gveditor_core_api::messaging::Messages;
use gveditor_core_api::{
    ManifestExtension,
    ManifestInfo,
};
use tokio::sync::mpsc::channel;

/// Loads an extension entrypoint directly, and waits for a message sent from it
#[tokio::test]
async fn load_sample_extension() {
    let (sd, mut rv) = channel::<Messages>(1);
    let mut manager = ExtensionsManager::new(sd.clone());

    let sample_info = ManifestInfo {
        extension: ManifestExtension {
            name: String::new(),
            id: String::new(),
            version: String::new(),
            author: String::new(),
            repository: String::new(),
            main: None,
        },
    };

    let location = current_dir().unwrap().join("tests/sample_extension.js");

    manager.load_extension_with_deno(location.to_str().unwrap(), sample_info, 0);

    assert_eq!(manager.extensions.len(), 2);

    if let LoadedExtension::ExtensionInstance { plugin, .. } = &manager.extensions[0] {
        let mut ext_plugin = plugin.lock().await;
        ext_plugin.init();
    }

    // Wait for the javascript to send the message
    rv.recv().await;
}

/// Loads the extension located under tests/extensions, executes it, and waits for a message sent from it
#[tokio::test]
async fn load_extensions_from_folder() {
    let (sd, mut rv) = channel::<Messages>(1);
    let mut manager = ExtensionsManager::new(sd.clone());

    let location = current_dir().unwrap().join("tests/extensions");
    let location = location.to_str().unwrap();

    manager
        .load_extensions_with_deno_in_directory(location, 0)
        .await;

    assert_eq!(manager.extensions.len(), 2);

    if let LoadedExtension::ExtensionInstance { plugin, .. } = &manager.extensions[0] {
        let mut ext_plugin = plugin.lock().await;
        ext_plugin.init();
    }

    // Wait for the javascript to send the message
    rv.recv().await;
}
