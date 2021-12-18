use gveditor_core::RPCResult;
use gveditor_core_api::filesystems::{
    DirItemInfo,
    FileInfo,
};
use gveditor_core_api::{
    Errors,
    State,
};

use crate::TauriState;

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn get_state_by_id(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Option<State>> {
    let res = tauri_state.client.get_state_by_id(state_id, token.clone());
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn list_dir_by_path(
    path: String,
    filesystem_name: String,
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Result<Vec<DirItemInfo>, Errors>> {
    let res = tauri_state
        .client
        .list_dir_by_path(path, filesystem_name, state_id, token);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn read_file_by_path(
    path: String,
    filesystem_name: String,
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Result<FileInfo, Errors>> {
    let res = tauri_state
        .client
        .read_file_by_path(path, filesystem_name, state_id, token);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn set_state_by_id(
    state_id: u8,
    state: State,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<()> {
    let res = tauri_state.client.set_state_by_id(state_id, state, token);
    res.await.unwrap();
    Ok(())
}
