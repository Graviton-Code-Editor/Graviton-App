import { StatusBarItemOptions } from "../modules/statusbar_item";
import { BaseMessage } from "../utils/client";
import { StateData } from "../utils/state";

export interface ShowPopup extends BaseMessage {
  popup_id: number;
  title: string;
  content: string;
}

export interface ShowStatusBarItem extends BaseMessage, StatusBarItemOptions {}

export interface StateUpdated {
  state: StateData;
}
