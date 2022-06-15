import { LanguageServerClient } from "codemirror-languageserver";
import { atom } from "recoil";
import { ContextMenuConfig } from "../components/ContextMenu/ContextMenu";
import { Prompt } from "../modules/prompt";
import { StatusBarItem } from "../modules/statusbar_item";
import { FloatingWindow } from "../modules/windows";
import TextEditorTab from "../tabs/text_editor/text_editor";
import { Client } from "../services/clients/client.types";
export { foldersState } from "./state/folders";
export { openedViewsAndTabs as openedViewsAndTabs } from "./state/views_tabs";
export { sidePanelsState } from "./state/side_panels";

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

// Displayed StatusBar Items
export const showedStatusBarItem = atom<{ [key: string]: StatusBarItem }>({
  key: "showedStatusBarItem",
  default: {},
  dangerouslyAllowMutability: true,
});

export interface LanguageServerConfig {
  rootUri: string;
  languageId: string;
  client: LanguageServerClient;
}

export const lspClients = atom<Array<LanguageServerConfig>>({
  key: "lspClients",
  default: [],
  dangerouslyAllowMutability: true,
});

export const contextMenuOpened = atom<ContextMenuConfig | null>({
  key: "contextMenuOpened",
  default: null,
});
