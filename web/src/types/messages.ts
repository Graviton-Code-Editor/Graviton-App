import { StateData } from "../utils/state";

export interface ShowPopup {
  msg_type: string;
  state_id: number;
  popup_id: number;
  title: string;
  content: string;
}

export interface StateUpdated {
  state: StateData;
}
