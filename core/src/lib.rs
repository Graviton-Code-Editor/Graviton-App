mod configuration;
pub mod handlers;
mod server;

pub use configuration::Configuration;
use gveditor_core_api::state::StatesList;
pub use server::{gen_client, RPCResult, Server};
pub use {jsonrpc_core_client, tokio};
