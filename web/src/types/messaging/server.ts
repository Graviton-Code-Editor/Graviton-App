import { StatusBarItemOptions } from "../../modules/statusbar_item";
import { BaseMessage } from "../../services/clients/client.types";
import { StateData } from "../../state/persistence";

export interface MessageFromExtension extends BaseMessage {
  state_id: number;
  extension_id: string;
  message: string;
}

export interface ShowPopup extends BaseMessage {
  popup_id: string;
  title: string;
  content: string;
}

export interface ShowStatusBarItem extends BaseMessage, StatusBarItemOptions {}

export interface HideStatusBarItem extends BaseMessage {
  id: string;
}

export interface StateUpdated {
  state_data: StateData;
}
