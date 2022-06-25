import { atom } from "recoil";
import { ContextMenuConfig } from "../components/ContextMenu/ContextMenu";
import { Prompt } from "../modules/prompt";
import { StatusBarItem } from "../modules/statusbar_item";
import { FloatingWindow } from "../modules/windows";
import TextEditorTab from "../tabs/text_editor/text_editor";
import { Client } from "../services/clients/client.types";
export { foldersState } from "./folders";
export { openedViewsAndTabs as openedViewsAndTabs } from "./views_tabs";
export { sidePanelsState } from "./side_panels";
import { Notification } from "../modules/notification";

// Client used across the app
export const clientState = atom({
  key: "clientState",
  default: null as unknown as Client,
});

// Registered prompts launchers
export const promptsState = atom<typeof Prompt[]>({
  key: "prompts",
  default: [],
});

// Registed Editors implementations
export const editors = atom<typeof TextEditorTab[]>({
  key: "editors",
  default: [TextEditorTab],
});

// Opened windows (popup, prompts...)
export const showedWindowsState = atom<FloatingWindow[]>({
  key: "showedWindows",
  default: [],
});

export const showedStatusBarItem = atom<{ [key: string]: StatusBarItem }>({
  key: "showedStatusBarItem",
  default: {},
  dangerouslyAllowMutability: true,
});

export const contextMenuOpened = atom<ContextMenuConfig | null>({
  key: "contextMenuOpened",
  default: null,
});

export const notificationsOpenedState = atom<Notification[]>({
  key: "notificationsOpened",
  default: [],
});
