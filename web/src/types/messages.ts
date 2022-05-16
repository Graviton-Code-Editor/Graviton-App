import { StatusBarItemOptions } from "../modules/statusbar_item";
import { StateData } from "../utils/state/state_data";
import { BaseMessage } from "./client";

export interface ShowPopup extends BaseMessage {
  popup_id: string;
  title: string;
  content: string;
}

export interface ShowStatusBarItem extends BaseMessage, StatusBarItemOptions {}

export interface HideStatusBarItem extends BaseMessage {
  statusbar_item_id: string;
}

export interface StateUpdated {
  state_data: StateData;
}


interface LanguageServerMessageBase {
  msg_type: string
}

export interface LanguageServerInitialization extends LanguageServerMessageBase {
  id: string;
}

export interface LanguageServerNotification  extends LanguageServerMessageBase {
  id: string;
  content: string;
}

type LanguageServerMessage = LanguageServerInitialization | LanguageServerNotification

export interface NotifyLanguageServers<T = LanguageServerMessage> extends BaseMessage {
  state_id: number;
  message: T
}