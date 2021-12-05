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
export default class FakeClient implements Client {
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
  // TODO
  listenToState() {
    return null;
  }
}
