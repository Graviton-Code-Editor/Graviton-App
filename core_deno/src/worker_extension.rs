use deno_core::error::AnyError;
use deno_core::{
    op_async,
    Extension,
    OpState,
};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::messaging::Messages;
use std::cell::RefCell;
use std::rc::Rc;

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

/// Crate the extension to bridge Graviton Core and the Deno extension
pub fn new(client: ExtensionClient) -> Extension {
    Extension::builder()
        .ops(vec![(
            "send_message_to_core",
            op_async(send_message_to_core),
        )])
        .state(move |s| {
            s.put(client.clone());
            Ok(())
        })
        .build()
}
