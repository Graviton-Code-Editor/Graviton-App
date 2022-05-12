use gveditor_core::RPCResult;
use gveditor_core_api::filesystems::{DirItemInfo, FileInfo};
use gveditor_core_api::state::StateData;
use gveditor_core_api::{Errors, LanguageServer, ManifestInfo};

use crate::TauriState;

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn get_state_by_id(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Option<StateData>> {
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
pub async fn write_file_by_path(
    path: String,
    content: String,
    filesystem_name: String,
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Result<(), Errors>> {
    let res =
        tauri_state
            .client
            .write_file_by_path(path, content, filesystem_name, state_id, token);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn set_state_by_id(
    state_id: u8,
    state_data: StateData,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Result<(), Errors>> {
    let res = tauri_state
        .client
        .set_state_by_id(state_id, state_data, token);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn get_ext_info_by_id(
    extension_id: String,
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Result<ManifestInfo, Errors>> {
    let res = tauri_state
        .client
        .get_ext_info_by_id(extension_id, state_id, token);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn get_ext_list_by_id(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Result<Vec<String>, Errors>> {
    let res = tauri_state.client.get_ext_list_by_id(state_id, token);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn get_all_language_servers(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Result<Vec<LanguageServer>, Errors>> {
    let res = tauri_state.client.get_all_language_servers(state_id, token);
    Ok(res.await.unwrap())
}
