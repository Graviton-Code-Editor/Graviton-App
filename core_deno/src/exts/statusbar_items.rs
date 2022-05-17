use deno_core::error::AnyError;
use deno_core::{op, Extension, OpState};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::extensions::modules::statusbar_item::StatusBarItem;
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

/// Create a status bar item
#[op]
async fn new_statusbar_item(
    state: Rc<RefCell<OpState>>,
    label: String,
    _: (),
) -> Result<String, AnyError> {
    let client: ExtensionClient = {
        let state = state.borrow();
        state.try_borrow::<ExtensionClient>().unwrap().clone()
    };

    let state_id = {
        let state = state.borrow();
        *state.try_borrow::<u8>().unwrap()
    };

    let item = StatusBarItem::new(client, state_id, &label);

    let mut state = state.borrow_mut();
    let items = state
        .try_borrow_mut::<HashMap<String, StatusBarItem>>()
        .unwrap();

    let item_id = item.id.clone();

    items.insert(item_id.clone(), item);

    Ok(item_id)
}

/// Show a status bar item
#[op]
async fn show_statusbar_item(
    state: Rc<RefCell<OpState>>,
    item_id: String,
    _: (),
) -> Result<(), AnyError> {
    let items = {
        let state = state.borrow();
        state
            .try_borrow::<HashMap<String, StatusBarItem>>()
            .unwrap()
            .clone()
    };

    let item = items.get(&item_id);

    if let Some(item) = item {
        item.show().await;
    }

    Ok(())
}

/// Hide a status bar item
#[op]
async fn hide_statusbar_item(
    state: Rc<RefCell<OpState>>,
    item_id: String,
    _: (),
) -> Result<(), AnyError> {
    let items = {
        let state = state.borrow();
        state
            .try_borrow::<HashMap<String, StatusBarItem>>()
            .unwrap()
            .clone()
    };

    let item = items.get(&item_id);

    if let Some(item) = item {
        item.hide().await;
    }

    Ok(())
}

/// Crate the extension to bridge Graviton Core and the Deno extension
pub fn new(client: ExtensionClient, state_id: u8) -> Extension {
    Extension::builder()
        .ops(vec![
            new_statusbar_item::decl(),
            show_statusbar_item::decl(),
            hide_statusbar_item::decl(),
        ])
        .state(move |s| {
            s.put(client.clone());
            s.put(state_id);
            s.put(HashMap::<String, StatusBarItem>::new());
            Ok(())
        })
        .build()
}
