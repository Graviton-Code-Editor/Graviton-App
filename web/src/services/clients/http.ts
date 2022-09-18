//@ts-ignore
import * as simple_jsonrpc from "simple-jsonrpc-js";
import Configuration from "utils/config";
import Emittery from "emittery";
import {
  BaseMessage,
  Client,
  CoreResponse,
  DirItemInfo,
  FileInfo,
  LanguageServer,
  ManifestInfo,
  TerminalShellBuilderInfo,
} from "./client.types";
import { StateData } from "state";

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
  public get_ext_list(): Promise<CoreResponse<string[]>> {
    return this.rpc.call("get_ext_list", [
      this.config.state_id,
      this.config.token,
    ]);
  }

  /*
   * Subscribe to the State messages
   * @WSCommand
   */
  public listenToState() {
    this.socket.send(
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
    return this.rpc.call("get_all_language_server_builders", [
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

  public get_terminal_shell_builders(): Promise<
    CoreResponse<TerminalShellBuilderInfo[]>
  > {
    return this.rpc.call("get_terminal_shell_builders", [
      this.config.state_id,
      this.config.token,
    ]);
  }

  public write_to_terminal_shell(
    terminal_shell_id: string,
    data: string,
  ): Promise<CoreResponse<never>> {
    return this.rpc.call("write_to_terminal_shell", [
      this.config.state_id,
      this.config.token,
      terminal_shell_id,
      data,
    ]);
  }

  public close_terminal_shell(
    terminal_shell_id: string,
  ): Promise<CoreResponse<never>> {
    return this.rpc.call("close_terminal_shell", [
      this.config.state_id,
      this.config.token,
      terminal_shell_id,
    ]);
  }

  public create_terminal_shell(
    terminal_shell_builder_id: string,
    terminal_shell_id: string,
  ): Promise<CoreResponse<never>> {
    return this.rpc.call("create_terminal_shell", [
      this.config.state_id,
      this.config.token,
      terminal_shell_builder_id,
      terminal_shell_id,
    ]);
  }

  public resize_terminal_shell(
    terminal_shell_id: string,
    cols: number,
    rows: number,
  ): Promise<CoreResponse<never>> {
    return this.rpc.call("resize_terminal_shell", [
      this.config.state_id,
      this.config.token,
      terminal_shell_id,
      cols,
      rows,
    ]);
  }

  public create_language_server(
    language_server_builder_id: string,
  ): Promise<CoreResponse<never>> {
    return this.rpc.call("create_language_server", [
      this.config.state_id,
      this.config.token,
      language_server_builder_id,
    ]);
  }

  public write_to_language_server(
    language_server_id: string,
    data: string,
  ): Promise<CoreResponse<never>> {
    return this.rpc.call("write_to_language_server", [
      this.config.state_id,
      this.config.token,
      language_server_id,
      data,
    ]);
  }
}
