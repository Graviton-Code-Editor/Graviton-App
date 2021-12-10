import { Client } from "./client";
import { TabData } from "../modules/tab";

export interface StateData {
  opened_tabs: Array<TabData>;
}
export class State {
  // Internal clients
  private client: Client;
  private id: number;

  // Shared state data
  public state: StateData;

  constructor(client: Client, id: number) {
    this.client = client;
    this.id = id;
    this.state = {
      opened_tabs: [],
    };
  }

  /*
   * Save the current state into the backend
   */
  public async save() {
    await this.client.set_state_by_id(this.state);
  }
}
