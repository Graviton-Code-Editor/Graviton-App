import Emittery from "emittery";
import {
  Client,
  CoreResponse,
  DirItemInfo,
  LanguageServer,
} from "../../src/services/clients/client.types";
import Configuration from "../../src/utils/config";
import { StateData } from "../../src/utils/state/state_data";

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
  ): Promise<CoreResponse<never>> {
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
  async get_ext_list_by_id(): Promise<any> {
    return null;
  }

  // TO-DO
  listenToState() {
    return null;
  }

  async get_all_language_servers(): Promise<any> {
    return null;
  }
}
