use gveditor_core_api::extensions::manager::{ExtensionsManager, LoadedExtension};
use gveditor_core_api::messaging::{ClientMessages, ServerMessages, UIEvent};
use gveditor_core_api::ManifestInfo;
use gveditor_core_deno::DenoExtensionSupport;
use std::env::current_dir;
use tokio::sync::mpsc::channel;

// TODO(marc2332) OnClick test

#[tokio::test]
async fn show_hide_statusbar_item() {
    let (sd, mut rv) = channel::<ClientMessages>(1);
    let mut manager = ExtensionsManager::new(sd.clone(), None);

    let location = current_dir()
        .unwrap()
        .join("tests/js/statusbar_item_extension.js");

    manager.load_extension_with_deno(location.to_str().unwrap(), ManifestInfo::default(), 0);

    // Load
    if let LoadedExtension::ExtensionInstance { plugin, .. } = &manager.extensions[0] {
        let mut ext_plugin = plugin.lock().await;
        ext_plugin.init();
    }

    // Wait for the button to be shown
    let msg = rv.recv().await.unwrap();

    assert_eq!(
        msg,
        ClientMessages::ServerMessage(ServerMessages::ShowStatusBarItem {
            label: "test".to_string(),
            state_id: 0,
            statusbar_item_id: "/1".to_string(),
        },)
    );

    // Simulate an onClick
    tokio::spawn(async move {
        if let LoadedExtension::ExtensionInstance { plugin, .. } = &manager.extensions[0] {
            let mut ext_plugin = plugin.lock().await;
            ext_plugin.notify(ClientMessages::UIEvent(UIEvent::StatusBarItemClicked {
                state_id: 0,
                id: "/1".to_string(),
            }));
        }
    });

    // Wait for the button to be hidden
    let msg = rv.recv().await.unwrap();

    assert_eq!(
        msg,
        ClientMessages::ServerMessage(ServerMessages::HideStatusBarItem {
            state_id: 0,
            statusbar_item_id: "/1".to_string(),
        },)
    );
}
