import Emittery from "emittery";
import { Client, CoreResponse, DirItemInfo } from "../../src/types/client";
import { StateData } from "../../src/utils/state";

/*
 * This simulates a real client
 * Only used for tests
 */
export default class FakeClient extends Emittery implements Client {
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
}
