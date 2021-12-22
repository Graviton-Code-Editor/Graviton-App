//@ts-ignore
import * as simple_jsonrpc from "simple-jsonrpc-js";
import Configuration from "./config";
import { StateData } from "./state";
import Emittery from "emittery";
import { emit, listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { isTauri } from "./commands";
import { ShowPopup, StateUpdated } from "../types/messages";

export interface BaseMessage {
  state_id: number;
  trigger: string;
  msg_type: string;
}
export interface CoreResponse<T> {
  Err?: any;
  Ok?: T;
}

export interface DirItemInfo {
  path: string;
  name: string;
  is_file: boolean;
}

export interface FileInfo {
  content: string;
  format: string;
}

export interface Client extends Emittery {
  get_state_by_id: () => Promise<StateData>;
  set_state_by_id: (state: StateData) => Promise<void>;
  read_file_by_path: (
    path: string,
    fs: string
  ) => Promise<CoreResponse<FileInfo>>;
  list_dir_by_path: (
    path: string,
    fs: string
  ) => Promise<CoreResponse<Array<DirItemInfo>>>;
  listenToState: () => void;
}

/*
 * HTTP Client
 */
export class HTTPClient extends Emittery implements Client {
  // Internal rpc client
  private rpc: simple_jsonrpc;
  // Internal websockets client
  private socket: WebSocket;
  private config: Configuration<string>;

  constructor(config: Configuration<string>) {
    super();
    this.rpc = simple_jsonrpc.connect_xhr(config.http_uri);
    this.socket = new WebSocket(config.ws_uri);
    this.config = config;

    this.socket.onmessage = (ev) => {
      const message: BaseMessage = JSON.parse(ev.data);
      this.emit(message.msg_type, message);
    };

    this.socket.onopen = () => {
      this.emit("connected");
    };
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public get_state_by_id(): Promise<StateData> {
    return this.rpc.call("get_state_by_id", [
      this.config.state_id,
      this.config.token,
    ]);
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public set_state_by_id(state: StateData): Promise<void> {
    return this.rpc.call("set_state_by_id", [
      this.config.state_id,
      state,
      this.config.token,
    ]);
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public read_file_by_path(
    path: string,
    filesystem_name: string
  ): Promise<CoreResponse<FileInfo>> {
    return this.rpc.call("read_file_by_path", [
      path,
      filesystem_name,
      this.config.state_id,
      this.config.token,
    ]);
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public list_dir_by_path(
    path: string,
    filesystem_name: string
  ): Promise<CoreResponse<Array<DirItemInfo>>> {
    return this.rpc.call("list_dir_by_path", [
      path,
      filesystem_name,
      this.config.state_id,
      this.config.token,
    ]);
  }

  /*
   * Listen for any mess in the websockets connection
   * @WSCommand
   */
  public listenToState() {
    this.socket.send(
      JSON.stringify({
        trigger: "client",
        msg_type: "ListenToState",
        state_id: this.config.state_id,
      })
    );
  }
}

type EventsInterface = Record<
  string,
  {
    ShowPopup: ShowPopup;
    ListenToState: StateUpdated;
    connected: null;
  } | null
>;

/*
 * Tauri Client
 */
export class TauriClient extends Emittery<EventsInterface> implements Client {
  private config: Configuration<null>;

  constructor(config: Configuration<null>) {
    super();
    this.config = config;

    listen("to_webview", ({ payload }: { payload: BaseMessage }) => {
      this.emit(payload.msg_type, payload as any);
    });

    invoke("init_listener");

    setTimeout(async () => {
      this.emit("connected", null);
    }, 1000);
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public get_state_by_id(): Promise<StateData> {
    return invoke("get_state_by_id", {
      stateId: this.config.state_id,
      token: this.config.token,
    });
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public set_state_by_id(state: StateData): Promise<void> {
    return invoke("set_state_by_id", {
      stateId: this.config.state_id,
      state,
      token: this.config.token,
    });
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public read_file_by_path(
    path: string,
    filesystemName: string
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
  public list_dir_by_path(
    path: string,
    filesystemName: string
  ): Promise<CoreResponse<Array<DirItemInfo>>> {
    return invoke("list_dir_by_path", {
      path,
      filesystemName,
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
        trigger: "client",
        msg_type: "ListenToState",
        state_id: this.config.state_id,
      })
    );
  }
}

export function createClient(token: string): Client {
  if (isTauri) {
    const config = new Configuration(null, null, 1, token);
    return new TauriClient(config);
  } else {
    const config = new Configuration(
      "http://localhost:50010",
      `ws://localhost:50010/websockets?token=${token}&state_id=1`,
      1,
      token
    );
    return new HTTPClient(config);
  }
}
