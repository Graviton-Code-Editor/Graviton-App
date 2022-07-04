import Emittery from "emittery";
import {
  Client,
  CoreResponse,
  DirItemInfo,
} from "../../src/services/clients/client.types";
import { StateData } from "../../src/state/persistence";
import Configuration from "../../src/utils/config";

/*
 * This simulates a real client
 * Only used for tests
 */
export default class FakeClient extends Emittery implements Client {
  config: Configuration<string>;
  emitMessage: (message: any) => Promise<void>;
  
  // TO-DO
  async write_file_by_path(
    path: string,
    content: string,
    fs: string
  ): Promise<any> {
    return null;
  }

  async whenConnected(): Promise<void> {
    return Promise.resolve();
  }

  // TO-DO
  async get_state_by_id(): Promise<any> {
    return null;
  }

  // TO-DO
  async set_state_by_id(state: Omit<StateData, "id">): Promise<any> {
    return null;
  }

  // TO-DO
  async read_file_by_path(path: string, fs: string): Promise<any> {
    return null;
  }

  async list_dir_by_path(
    path: string,
    fs: string
  ): Promise<CoreResponse<DirItemInfo[]>> {
    return {
      Ok: [
        {
          path: "/tests/readme.md",
          name: "readme.md",
          is_file: true,
        },
      ],
    };
  }

  // TO-DO
  async get_ext_info_by_id(extension_id: string): Promise<any> {
    return null;
  }

  // TO-DO
  async get_ext_list(): Promise<any> {
    return null;
  }

  // TO-DO
  listenToState() {
    return null;
  }

  // TO-DO
  async get_all_language_server_builders(): Promise<any> {
    return null;
  }

  // TO-DO
  async get_terminal_shell_builders(): Promise<any>{
    return null;
  }

  // TO-DO
  async write_to_terminal_shell(terminal_shell_id: string, data: string): Promise<any>{
    return null;
  }

  // TO-DO
  async close_terminal_shell(terminal_shell_id: string): Promise<any>{
    return null;
  }

  // TO-DO
  async create_terminal_shell(terminal_shell_builder_id: string, terminal_shell_id: string): Promise<any>{
    return null;
  }

  // TO-DO
  async resize_terminal_shell(terminal_shell_id: string, cols: number, rows: number): Promise<any>{
    return null;
  }

  // TO-DO
  async create_language_server(language_server_builder_id: string): Promise<any> {
    return null;
  }

  // TO-DO
  async write_to_language_server(language_server_id: string, data: string): Promise<any>{
    return null;
  }
}
