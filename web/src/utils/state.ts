import { atom } from "recoil";
import { Prompt } from "../modules/prompt";
import { StatusBarItem } from "../modules/statusbar_item";
import { FloatingWindow } from "../modules/windows";
import TextEditorTab from "../tabs/text_editor";
import { Client } from "../types/client";
export { foldersState } from "./state/folders";
export { tabsState } from "./state/tabs";
export { panelsState } from "./state/panels";

// Client used across the app
export const clientState = atom({
  key: "clientState",
  default: null as unknown as Client,
});

// Registered prompts launchers
export const prompts = atom<typeof Prompt[]>({
  key: "prompts",
  default: [],
});

// Registed Editors implementations
export const editors = atom<typeof TextEditorTab[]>({
  key: "editors",
  default: [TextEditorTab],
});

// Opened windows (popup, prompts...)
export const showedWindows = atom<FloatingWindow[]>({
  key: "showedWindows",
  default: [],
});

// Displayed StatusBar Items
export const showedStatusBarItem = atom<{ [key: string]: StatusBarItem }>({
  key: "showedStatusBarItem",
  default: {},
});
