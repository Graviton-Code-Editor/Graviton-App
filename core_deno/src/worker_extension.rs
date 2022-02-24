use deno_core::error::AnyError;
use deno_core::{
    op_async,
    Extension,
    OpState,
};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::messaging::{
    ExtensionMessages,
    Messages,
};
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use tokio::sync::mpsc;
use uuid::Uuid;

use crate::{
    EventListeners,
    WorkerHandle,
};

/// Send Core Messages from deno
async fn listen_messages_from_core(
    state: Rc<RefCell<OpState>>,
    event_name: String,
    _: (),
) -> Result<ExtensionMessages, AnyError> {
    let (s, mut r) = mpsc::channel(1);
    let s_id = Uuid::new_v4();

    let state = state.borrow();

    let listeners: &EventListeners = state.try_borrow::<EventListeners>().unwrap();

    // Create the event map if not found
    listeners
        .lock()
        .await
        .try_insert(event_name.clone(), HashMap::new())
        .ok();

    // Insert the listener
    listeners
        .lock()
        .await
        .get_mut(&event_name)
        .unwrap()
        .insert(s_id, s);

    let event = r.recv().await;

    listeners
        .lock()
        .await
        .get_mut(&event_name)
        .unwrap()
        .remove(&s_id);

    // TODO, remove the event hashmap if no more senders are on it

    Ok(event.unwrap())
}

/// Send Core Messages from deno
async fn send_message_to_core(
    state: Rc<RefCell<OpState>>,
    msg: Messages,
    _: (),
) -> Result<(), AnyError> {
    let state = state.borrow();

    let client: &ExtensionClient = state.try_borrow::<ExtensionClient>().unwrap();

    client.send(msg).await?;

    Ok(())
}

/// Terminate the worker
async fn terminate_main_worker(state: Rc<RefCell<OpState>>, _: (), _: ()) -> Result<(), AnyError> {
    let state = state.borrow();

    let worker_handle: &WorkerHandle = state.try_borrow::<WorkerHandle>().unwrap();

    if let Some(handle) = &*worker_handle.lock().await {
        handle.terminate_execution();
    }

    Ok(())
}

/// Crate the extension to bridge Graviton Core and the Deno extension
pub fn new(
    client: ExtensionClient,
    listeners: EventListeners,
    worker_handle: WorkerHandle,
) -> Extension {
    Extension::builder()
        .ops(vec![
            ("send_message_to_core", op_async(send_message_to_core)),
            (
                "listen_messages_from_core",
                op_async(listen_messages_from_core),
            ),
            ("terminate_main_worker", op_async(terminate_main_worker)),
        ])
        .state(move |s| {
            s.put(client.clone());
            s.put(listeners.clone());
            s.put(worker_handle.clone());
            Ok(())
        })
        .build()
}
