import { StatusBarItemOptions } from "features";
import { BaseMessage } from "services/clients/client.types";
import { StateData } from "state";

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

export interface TerminalShellUpdated extends BaseMessage {
  terminal_shell_id: string;
  data: Uint8Array;
}

export interface RegisterCommand extends BaseMessage {
  name: string;
  id: string;
}

export interface UnloadedLanguageServer extends BaseMessage {
  id: string;
}
