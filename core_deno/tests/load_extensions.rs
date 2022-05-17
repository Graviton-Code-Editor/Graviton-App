use gveditor_core_api::extensions::manager::{ExtensionsManager, LoadedExtension};
use gveditor_core_api::messaging::{ClientMessages, ServerMessages};
use gveditor_core_api::{ManifestExtension, ManifestInfo};
use gveditor_core_deno::DenoExtensionSupport;
use std::env::current_dir;
use tokio::sync::mpsc::channel;

static MANIFEST_INFO_SAMPLE: ManifestInfo = ManifestInfo {
    extension: ManifestExtension {
        name: String::new(),
        id: String::new(),
        version: String::new(),
        author: String::new(),
        repository: String::new(),
        main: None,
    },
};

/// Loads an extension entry file directly, and waits for a message sent from it
#[tokio::test]
async fn load_sample_extension() {
    let (sd, _) = channel::<ClientMessages>(1);
    let mut manager = ExtensionsManager::new(sd.clone(), None);

    let location = current_dir().unwrap().join("tests/sample_extension.js");

    manager.load_extension_with_deno(location.to_str().unwrap(), MANIFEST_INFO_SAMPLE.clone(), 0);

    assert_eq!(manager.extensions.len(), 2);
}

/// Loads the extension located under tests/extensions, executes it, and waits for a message sent from it
#[tokio::test]
async fn load_extensions_from_folder() {
    let (sd, _) = channel::<ClientMessages>(1);
    let mut manager = ExtensionsManager::new(sd.clone(), None);

    let location = current_dir().unwrap().join("tests/extensions");
    let location = location.to_str().unwrap();

    manager
        .load_extensions_with_deno_in_directory(location, 0)
        .await;

    assert_eq!(manager.extensions.len(), 2);
}

#[tokio::test]
async fn send_receive_events() {
    let (sd, mut rv) = channel::<ClientMessages>(1);
    let mut manager = ExtensionsManager::new(sd.clone(), None);

    let location = current_dir().unwrap().join("tests/sample_extension.js");

    manager.load_extension_with_deno(location.to_str().unwrap(), MANIFEST_INFO_SAMPLE.clone(), 0);

    // Load
    if let LoadedExtension::ExtensionInstance { plugin, .. } = &manager.extensions[0] {
        let mut ext_plugin = plugin.lock().await;
        ext_plugin.init();
    }

    // Wait for the javascript to send a response
    rv.recv().await;

    // Send some dumy event
    if let LoadedExtension::ExtensionInstance { plugin, .. } = &manager.extensions[0] {
        let mut ext_plugin = plugin.lock().await;
        ext_plugin.notify(ClientMessages::ListDir(
            0,
            "".to_string(),
            "".to_string(),
            Ok(vec![]),
        ));
    }

    // Wait for the javascript to send a response
    rv.recv().await;

    // Unload
    if let LoadedExtension::ExtensionInstance { plugin, .. } = &manager.extensions[0] {
        let mut ext_plugin = plugin.lock().await;
        ext_plugin.unload();
    }

    // Wait for the javascript to send a response
    rv.recv().await;
}

#[tokio::test]
async fn show_hide_statusbar_item() {
    let (sd, mut rv) = channel::<ClientMessages>(1);
    let mut manager = ExtensionsManager::new(sd.clone(), None);

    let location = current_dir()
        .unwrap()
        .join("tests/statusbar_item_extension.js");

    manager.load_extension_with_deno(location.to_str().unwrap(), MANIFEST_INFO_SAMPLE.clone(), 0);

    // Load
    if let LoadedExtension::ExtensionInstance { plugin, .. } = &manager.extensions[0] {
        let mut ext_plugin = plugin.lock().await;
        ext_plugin.init();
    }

    // Wait for the javascript to send an event
    let msg = rv.recv().await.unwrap();

    assert_eq!(
        msg,
        ClientMessages::ServerMessage(ServerMessages::ShowStatusBarItem {
            label: "test".to_string(),
            state_id: 0,
            statusbar_item_id: "/1".to_string(),
        },)
    );
}
