import { atom } from "recoil";
import BaseEditor from "../editors/base";
import TextEditor from "../editors/text";
import { Prompt } from "../modules/prompt";
import GlobalPrompt from "../prompts/global";
import {
  FocusedTab,
  FolderState,
  PanelState,
  TabsPanels,
} from "../types/types";
import { Client } from "./client";

// Opened tabs
export const openedTabsState = atom({
  key: "openedTabs",
  default: [[[]]] as TabsPanels,
  dangerouslyAllowMutability: true,
});

// Opened panels
export const panels = atom({
  key: "panels",
  default: [] as Array<PanelState>,
});

// Client used across the app
export const clientState = atom({
  key: "clientState",
  default: null as unknown as Client,
});

// Current focused (clicked) tab
export const focusedTab = atom<FocusedTab>({
  key: "focusedTab",
  default: { row: 0, col: 0, id: null },
});

// Registered prompts launchers
export const prompts = atom<typeof Prompt[]>({
  key: "prompts",
  default: [GlobalPrompt],
});

// Current launched prompt
export const prompt = atom<Prompt | null>({
  key: "prompt",
  default: null,
});

// Registed Editors implementations
export const editors = atom<typeof BaseEditor[]>({
  key: "editors",
  default: [TextEditor],
});

// Opened folders in the explorer panel
export const openedFolders = atom<FolderState[]>({
  key: "openedFolders",
  default: [],
});
