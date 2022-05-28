//@ts-ignore
import * as simple_jsonrpc from "simple-jsonrpc-js";
import Configuration from "../config";
import Emittery from "emittery";
import {
  BaseMessage,
  Client,
  CoreResponse,
  DirItemInfo,
  FileInfo,
  LanguageServer,
  ManifestInfo,
} from "../../types/client";
import { StateData } from "../state/state_data";

/**
 * HTTP + WebSockets client
 *
 * This makes it possible to comunicate with a Graviton Core via HTTP and WebSockets. This is useful when using Graviton remotely
 */
export class HTTPClient extends Emittery implements Client {
  // Internal rpc client
  private rpc: simple_jsonrpc;

  // Internal websockets client
  private socket: WebSocket;
  public config: Configuration<string>;

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
   * Promise wrapper for `connected` event
   */
  public whenConnected() {
    return new Promise<void>((resolve) => {
      this.on("connected", () => {
        resolve();
      });
    });
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public get_state_by_id(): Promise<CoreResponse<StateData>> {
    return this.rpc.call("get_state_by_id", [
      this.config.state_id,
      this.config.token,
    ]);
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public set_state_by_id(state_data: Omit<StateData, "id">): Promise<void> {
    return this.rpc.call("set_state_by_id", [
      this.config.state_id,
      {
        ...state_data,
        id: this.config.state_id,
      },
      this.config.token,
    ]);
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public read_file_by_path(
    path: string,
    filesystem_name: string,
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
  public write_file_by_path(
    path: string,
    content: string,
    filesystem_name: string,
  ): Promise<CoreResponse<never>> {
    return this.rpc.call("write_file_by_path", [
      path,
      content,
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
    filesystem_name: string,
  ): Promise<CoreResponse<Array<DirItemInfo>>> {
    return this.rpc.call("list_dir_by_path", [
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
  public get_ext_info_by_id(
    extension_id: string,
  ): Promise<CoreResponse<ManifestInfo>> {
    return this.rpc.call("get_ext_info_by_id", [
      extension_id,
      this.config.state_id,
      this.config.token,
    ]);
  }

  /*
   * Implemented in the Core
   * @JsonRpcMethod
   */
  public get_ext_list_by_id(): Promise<CoreResponse<string[]>> {
    return this.rpc.call("get_ext_list_by_id", [
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
        msg_type: "ListenToState",
        state_id: this.config.state_id,
      }),
    );
  }

  public get_all_language_servers(): Promise<CoreResponse<LanguageServer[]>> {
    return this.rpc.call("get_all_language_servers", [
      this.config.state_id,
      this.config.token,
    ]);
  }

  public async emitMessage<T>(message: T) {
    this.socket.send(
      JSON.stringify({
        ...message,
      }),
    );
  }
}
