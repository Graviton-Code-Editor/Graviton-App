use gveditor_core_api::extensions::manager::{ExtensionsManager, LoadedExtension};
use gveditor_core_api::messaging::ClientMessages;
use gveditor_core_api::ManifestInfo;
use gveditor_core_deno::DenoExtensionSupport;
use std::env::current_dir;
use tokio::sync::mpsc::channel;

#[tokio::test]
async fn send_receive_events() {
    let (sd, mut rv) = channel::<ClientMessages>(1);
    let mut manager = ExtensionsManager::new(sd.clone(), None);

    let location = current_dir().unwrap().join("tests/js/sample_extension.js");

    manager.load_extension_with_deno(location.to_str().unwrap(), ManifestInfo::default(), 0);

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
