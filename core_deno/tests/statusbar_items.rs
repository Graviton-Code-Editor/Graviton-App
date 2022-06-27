use gveditor_core_api::extensions::manager::{ExtensionsManager, LoadedExtension};
use gveditor_core_api::messaging::{ClientMessages, ServerMessages, UIEvent};
use gveditor_core_api::{ManifestInfo, Mutex, State};
use gveditor_core_deno::DenoExtensionSupport;
use std::env::current_dir;
use std::sync::Arc;
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
        ext_plugin.init(Arc::new(Mutex::new(State::default())));
    }

    // Wait for the button to be shown
    let msg = rv.recv().await.unwrap();

    assert!(matches!(
        msg,
        ClientMessages::ServerMessage(ServerMessages::ShowStatusBarItem { .. },)
    ));

    let mut statusbar_item_id = "".to_string();

    if let ClientMessages::ServerMessage(ServerMessages::ShowStatusBarItem { id, .. }) = msg {
        statusbar_item_id = id;
    }

    let statusbar_item_id_on_click = statusbar_item_id.clone();

    // Simulate an onClick
    tokio::spawn(async move {
        if let LoadedExtension::ExtensionInstance { plugin, .. } = &manager.extensions[0] {
            let mut ext_plugin = plugin.lock().await;
            ext_plugin.notify(ClientMessages::UIEvent(UIEvent::StatusBarItemClicked {
                state_id: 0,
                id: statusbar_item_id_on_click,
            }));
        }
    });

    // Wait for the button to be hidden
    let msg = rv.recv().await.unwrap();

    assert_eq!(
        msg,
        ClientMessages::ServerMessage(ServerMessages::HideStatusBarItem {
            state_id: 0,
            id: statusbar_item_id,
        },)
    );
}
