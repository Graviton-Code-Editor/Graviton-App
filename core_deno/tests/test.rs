use std::env::current_dir;

use core_deno::DenoExtensionSupport;
use gveditor_core_api::extensions::base::ExtensionInfo;
use gveditor_core_api::extensions::manager::{
    ExtensionsManager,
    LoadedExtension,
};
use gveditor_core_api::messaging::Messages;
use tokio::sync::mpsc::channel;

#[tokio::test]
async fn load_sample_extension() {
    let (sd, mut rv) = channel::<Messages>(1);
    let mut manager = ExtensionsManager::new(sd.clone());

    let sample_info = ExtensionInfo {
        id: "sample".to_string(),
        name: "sample".to_string(),
    };

    let location = current_dir().unwrap().join("tests/sample_extension.js");

    manager.load_extension_with_deno(location.to_str().unwrap(), sample_info, 0);

    if let LoadedExtension::ExtensionInstance { plugin, .. } = &manager.extensions[0] {
        let mut ext_plugin = plugin.lock().await;
        ext_plugin.init();
    }

    // Wait for the javascript to send the message
    rv.recv().await;
}
