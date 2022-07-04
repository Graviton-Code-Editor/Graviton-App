import { emit, listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import Emittery from "emittery";
import {
  BaseMessage,
  Client,
  CoreResponse,
  DirItemInfo,
  EventsInterface,
  FileInfo,
  LanguageServer,
  ManifestInfo as ManifestInfo,
  TerminalShellBuilderInfo,
} from "./client.types";
import Configuration from "../../utils/config";
import { StateData } from "../../state/persistence";

/**
 * Tauri Client
 *
 * This makes use of Tauri's commands and events system, as a bridge to communicate the webview frontend and the Graviton core
 */
export class TauriClient extends Emittery<EventsInterface> implements Client {
  public config: Configuration<null>;

  constructor(config: Configuration<null>) {
    super();
    this.config = config;

    listen("to_webview", ({ payload }: { payload: BaseMessage }) => {
      this.emit(payload.msg_type, payload as any);
    });

    setTimeout(async () => {
      this.emit("connected", null);
    }, 1);
  }

  public whenConnected() {
    return Promise.resolve();
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public get_state_by_id(): Promise<CoreResponse<StateData>> {
    return invoke("get_state_by_id", {
      stateId: this.config.state_id,
      token: this.config.token,
    });
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public set_state_by_id(state_data: Omit<StateData, "id">): Promise<void> {
    return invoke("set_state_by_id", {
      stateId: this.config.state_id,
      stateData: {
        ...state_data,
        id: this.config.state_id,
      },
      token: this.config.token,
    });
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public read_file_by_path(
    path: string,
    filesystemName: string,
  ): Promise<CoreResponse<FileInfo>> {
    return invoke("read_file_by_path", {
      path,
      filesystemName,
      stateId: this.config.state_id,
      token: this.config.token,
    });
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public write_file_by_path(
    path: string,
    content: string,
    filesystemName: string,
  ): Promise<CoreResponse<never>> {
    return invoke("write_file_by_path", {
      path,
      content,
      filesystemName,
      stateId: this.config.state_id,
      token: this.config.token,
    });
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public list_dir_by_path(
    path: string,
    filesystemName: string,
  ): Promise<CoreResponse<Array<DirItemInfo>>> {
    return invoke("list_dir_by_path", {
      path,
      filesystemName,
      stateId: this.config.state_id,
      token: this.config.token,
    });
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public get_ext_info_by_id(
    extensionId: string,
  ): Promise<CoreResponse<ManifestInfo>> {
    return invoke("get_ext_info_by_id", {
      extensionId,
      stateId: this.config.state_id,
      token: this.config.token,
    });
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public get_ext_list(): Promise<CoreResponse<string[]>> {
    return invoke("get_ext_list", {
      stateId: this.config.state_id,
      token: this.config.token,
    });
  }

  /*
   * Listen for any mess in the websockets connection
   * @WSCommand
   */
  public listenToState() {
    emit(
      "to_core",
      JSON.stringify({
        ListenToState: {
          state_id: this.config.state_id,
        },
      }),
    );
  }

  public get_all_language_server_builders(): Promise<
    CoreResponse<LanguageServer[]>
  > {
    return invoke("get_all_language_server_builders", {
      stateId: this.config.state_id,
      token: this.config.token,
    });
  }

  public async emitMessage<T>(message: T) {
    await emit(
      "to_core",
      JSON.stringify({
        ...message,
      }),
    );
  }

  public get_terminal_shell_builders(): Promise<
    CoreResponse<TerminalShellBuilderInfo[]>
  > {
    return invoke("get_terminal_shell_builders", {
      stateId: this.config.state_id,
      token: this.config.token,
    });
  }

  public write_to_terminal_shell(
    terminal_shell_id: string,
    data: string,
  ): Promise<CoreResponse<never>> {
    return invoke("write_to_terminal_shell", {
      stateId: this.config.state_id,
      token: this.config.token,
      terminalShellId: terminal_shell_id,
      data,
    });
  }

  public close_terminal_shell(
    terminal_shell_id: string,
  ): Promise<CoreResponse<never>> {
    return invoke("close_terminal_shell", {
      stateId: this.config.state_id,
      token: this.config.token,
      terminalShellId: terminal_shell_id,
    });
  }

  public create_terminal_shell(
    terminal_shell_builder_id: string,
    terminal_shell_id: string,
  ): Promise<CoreResponse<never>> {
    return invoke("create_terminal_shell", {
      stateId: this.config.state_id,
      token: this.config.token,
      terminalShellBuilderId: terminal_shell_builder_id,
      terminalShellId: terminal_shell_id,
    });
  }

  public resize_terminal_shell(
    terminal_shell_id: string,
    cols: number,
    rows: number,
  ): Promise<CoreResponse<never>> {
    return invoke("resize_terminal_shell", {
      stateId: this.config.state_id,
      token: this.config.token,
      terminalShellId: terminal_shell_id,
      cols,
      rows,
    });
  }

  public create_language_server(
    language_server_builder_id: string,
  ): Promise<CoreResponse<never>> {
    return invoke("create_language_server", {
      stateId: this.config.state_id,
      token: this.config.token,
      languageServerBuilderId: language_server_builder_id,
    });
  }

  public write_to_language_server(
    language_server_id: string,
    data: string,
  ): Promise<CoreResponse<never>> {
    return invoke("write_to_language_server", {
      stateId: this.config.state_id,
      token: this.config.token,
      languageServerId: language_server_id,
      data,
    });
  }
}
