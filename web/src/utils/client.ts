import Configuration from "./config";
import { isTauri } from "./commands";
import { Client } from "../types/client";
import { TauriClient } from "./clients/tauri";
import { HTTPClient } from "./clients/http";

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
