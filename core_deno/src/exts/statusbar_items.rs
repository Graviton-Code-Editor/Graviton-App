use deno_core::error::AnyError;
use deno_core::{op, Extension, OpState};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::extensions::modules::statusbar_item::StatusBarItem;
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use tokio::sync::mpsc::channel;

/// Create a status bar item
#[op]
async fn op_new_statusbar_item(
    state: Rc<RefCell<OpState>>,
    label: String,
    _: (),
) -> Result<String, AnyError> {
    let (client, state_id) = {
        let state = state.borrow();
        let client = state.borrow::<ExtensionClient>().to_owned();
        let state_id = *state.borrow::<u8>();
        (client, state_id)
    };

    let item = StatusBarItem::new(client, state_id, &label);

    let mut state = state.borrow_mut();
    let items = state.borrow_mut::<HashMap<String, StatusBarItem>>();

    let item_id = item.id.clone();

    items.insert(item_id.clone(), item);

    Ok(item_id)
}

/// Show a status bar item
#[op]
async fn op_show_statusbar_item(
    state: Rc<RefCell<OpState>>,
    item_id: String,
    _: (),
) -> Result<(), AnyError> {
    let items = {
        let state = state.borrow();
        state.borrow::<HashMap<String, StatusBarItem>>().to_owned()
    };

    let item = items.get(&item_id);

    if let Some(item) = item {
        item.show().await;
    }

    Ok(())
}

/// Hide a status bar item
#[op]
async fn op_hide_statusbar_item(
    state: Rc<RefCell<OpState>>,
    item_id: String,
    _: (),
) -> Result<(), AnyError> {
    let items = {
        let state = state.borrow();
        state.borrow::<HashMap<String, StatusBarItem>>().to_owned()
    };

    let item = items.get(&item_id);

    if let Some(item) = item {
        item.hide().await;
    }

    Ok(())
}

/// Register an onClick listener for the given status bar item
#[op]
async fn op_on_click_statusbar_item(
    state: Rc<RefCell<OpState>>,
    item_id: String,
    _: (),
) -> Result<(), AnyError> {
    let mut items = {
        let state = state.borrow_mut();
        state.borrow::<HashMap<String, StatusBarItem>>().to_owned()
    };

    let item = items.get_mut(&item_id);

    if let Some(item) = item {
        let (tx, mut rv) = channel::<()>(1);

        item.on_click(tx).await;

        rv.recv().await;
    }

    Ok(())
}

/// Set the label for the given status bar item
#[op]
async fn op_set_statusbar_item_label(
    state: Rc<RefCell<OpState>>,
    item_id: String,
    label: String,
    _: (),
) -> Result<(), AnyError> {
    let mut items = {
        let mut state = state.borrow_mut();
        state
            .borrow_mut::<HashMap<String, StatusBarItem>>()
            .to_owned()
    };

    let item = items.get_mut(&item_id);

    if let Some(item) = item {
        item.set_label(&label).await;
    }

    Ok(())
}

/// StatusBar Item module for Deno
pub fn new(client: ExtensionClient, state_id: u8) -> Extension {
    Extension::builder()
        .ops(vec![
            op_new_statusbar_item::decl(),
            op_show_statusbar_item::decl(),
            op_hide_statusbar_item::decl(),
            op_on_click_statusbar_item::decl(),
            op_set_statusbar_item_label::decl(),
        ])
        .state(move |s| {
            s.put(client.clone());
            s.put(state_id);
            s.put(HashMap::<String, StatusBarItem>::new());
            Ok(())
        })
        .build()
}
