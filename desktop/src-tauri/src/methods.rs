use gveditor_core::RPCResult;
use gveditor_core_api::filesystems::{DirItemInfo, FileInfo};
use gveditor_core_api::language_servers::LanguageServerBuilderInfo;
use gveditor_core_api::states::StateData;
use gveditor_core_api::terminal_shells::TerminalShellBuilderInfo;
use gveditor_core_api::{Errors, ManifestInfo};

use crate::TauriState;

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn get_state_by_id(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Result<Option<StateData>, Errors>> {
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
pub async fn get_ext_list(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Result<Vec<String>, Errors>> {
    let res = tauri_state.client.get_ext_list(state_id, token);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn get_all_language_server_builders(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Result<Vec<LanguageServerBuilderInfo>, Errors>> {
    let res = tauri_state
        .client
        .get_all_language_server_builders(state_id, token);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn write_to_terminal_shell(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
    terminal_shell_id: String,
    data: String,
) -> RPCResult<Result<(), Errors>> {
    let res = tauri_state
        .client
        .write_to_terminal_shell(state_id, token, terminal_shell_id, data);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn create_terminal_shell(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
    terminal_shell_builder_id: String,
    terminal_shell_id: String,
) -> RPCResult<Result<(), Errors>> {
    let res = tauri_state.client.create_terminal_shell(
        state_id,
        token,
        terminal_shell_builder_id,
        terminal_shell_id,
    );
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn close_terminal_shell(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
    terminal_shell_id: String,
) -> RPCResult<Result<(), Errors>> {
    let res = tauri_state
        .client
        .close_terminal_shell(state_id, token, terminal_shell_id);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn get_terminal_shell_builders(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
) -> RPCResult<Result<Vec<TerminalShellBuilderInfo>, Errors>> {
    let res = tauri_state
        .client
        .get_terminal_shell_builders(state_id, token);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn resize_terminal_shell(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
    terminal_shell_id: String,
    cols: u16,
    rows: u16,
) -> RPCResult<Result<(), Errors>> {
    let res =
        tauri_state
            .client
            .resize_terminal_shell(state_id, token, terminal_shell_id, cols, rows);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn create_language_server(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
    language_server_builder_id: String,
) -> RPCResult<Result<(), Errors>> {
    let res =
        tauri_state
            .client
            .create_language_server(state_id, token, language_server_builder_id);
    Ok(res.await.unwrap())
}

/// Same as the JSON RPC Method
#[tauri::command(async)]
pub async fn write_to_language_server(
    state_id: u8,
    token: String,
    tauri_state: tauri::State<'_, TauriState>,
    language_server_id: String,
    data: String,
) -> RPCResult<Result<(), Errors>> {
    let res =
        tauri_state
            .client
            .write_to_language_server(state_id, token, language_server_id, data);
    Ok(res.await.unwrap())
}
