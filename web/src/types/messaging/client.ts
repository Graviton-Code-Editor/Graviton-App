import { BaseMessage } from "../../services/clients/client.types";

///////// NotifyExtension Messages

export interface ExtensionMessage extends BaseMessage {
  content: string;
  extension_id: string;
}

export interface NotifyExtension<T = ExtensionMessage> {
  NotifyExtension: T;
}

///////// UI Events Messages

export interface StatusBarItemClicked extends BaseMessage {
  id: string;
}

export type UIEvents = StatusBarItemClicked;

export interface UIEvent<T = UIEvents> {
  UIEvent: T;
}
