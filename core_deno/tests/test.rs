#![feature(is_some_with)]

use std::env::current_dir;

use core_deno::{
    DenoExtensionSupport,
    Manifest,
    ManifestErrors,
};
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

#[tokio::test]
async fn load_manifests() {
    let cwd = current_dir().unwrap();

    let ok_manifest_path = cwd.join("tests/ok_manifest.toml");
    let bad_manifest_path = cwd.join("tests/bad_manifest.toml");
    let not_found_manifest_path = cwd.join("this_doesnt_exist");

    let ok_manifest = Manifest::parse(&ok_manifest_path).await;
    let bad_manifest = Manifest::parse(&bad_manifest_path).await;
    let not_found_manifest = Manifest::parse(&not_found_manifest_path).await;

    assert!(ok_manifest.is_ok());
    assert!(bad_manifest.is_err_with(|e| matches!(e, &ManifestErrors::CannotParse)));
    assert!(not_found_manifest.is_err_with(|e| matches!(e, &ManifestErrors::NotFound)));
}
