use core_deno::DenoExtensionSupport;
use gveditor_core_api::extensions::base::ExtensionInfo;
use gveditor_core_api::extensions::manager::ExtensionsManager;

#[tokio::main]
#[test]
async fn test_sample_ext() {
    let mut manager = ExtensionsManager::default();

    let sample_info = ExtensionInfo {
        id: "sample".to_string(),
        name: "sample".to_string(),
    };

    manager
        .load_extension_with_deno("oh.js", sample_info, 0)
        .await;
}
