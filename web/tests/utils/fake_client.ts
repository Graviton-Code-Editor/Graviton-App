import Emittery from "emittery";
import {
  Client,
  CoreResponse,
  DirItemInfo,
  FileInfo,
} from "../../src/utils/client";
import { StateData } from "../../src/utils/state";

/*
 * This simulates a real client
 * Only used for tests
 */
export default class FakeClient extends Emittery implements Client {
  // TO-DO
  async get_state_by_id(): Promise<any> {
    return null;
  }
  // TO-DO
  async set_state_by_id(state: StateData): Promise<any> {
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

  async get_ext_info_by_id(extension_id: string): Promise<any> {
    return null;
  }

  async get_ext_list_by_id(): Promise<any> {
    return null;
  }

  // TODO
  listenToState() {
    return null;
  }
}
