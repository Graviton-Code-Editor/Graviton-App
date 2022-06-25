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
  public get_ext_list_by_id(): Promise<CoreResponse<string[]>> {
    return invoke("get_ext_list_by_id", {
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

  public get_all_language_servers(): Promise<CoreResponse<LanguageServer[]>> {
    return invoke("get_all_language_servers", {
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
}
