import { atom } from "recoil";
import { getRecoil } from "recoil-nexus";
import { EditorFinder } from "../hooks/useEditor";
import { Prompt } from "../modules/prompt";
import { StatusBarItem } from "../modules/statusbar_item";
import { BasicTabData, Tab, TabData, TextEditorTabData } from "../modules/tab";
import { FloatingWindow } from "../modules/windows";
import SettingsTab from "../tabs/settings";
import TextEditorTab from "../tabs/text_editor";
import WelcomeTab from "../tabs/welcome";
import { Client } from "../types/client";
import {
  FocusedTab,
  FolderState,
  PanelState,
  TabsPanels,
} from "../types/types";
import { StateData } from "./state";

type TabDataList = Array<TabDataList | TabData> | TabData;
type TabList<T> = Array<TabList<T> | T> | T;

function tabToTabDataRecursively(val: TabList<Tab>): TabDataList {
  if (Array.isArray(val)) {
    return val.map(tabToTabDataRecursively);
  } else {
    return val.toJson();
  }
}

export function tabDataToTabRecursively(
  tabData: TabDataList,
  getEditor: EditorFinder
): TabList<undefined | TextEditorTab | Tab> {
  if (Array.isArray(tabData)) {
    return tabData
      .map((tab) => tabDataToTabRecursively(tab, getEditor))
      .filter(Boolean);
  } else {
    switch (tabData.tab_type) {
      case "TextEditor": {
        const data = tabData as TextEditorTabData;
        const editor = getEditor(data.format);
        if (editor != null) {
          const tab = new editor(data.filename, data.path, data.content, data.format);
          return tab;
        }
        break;
      }
      default: {
        const basicTabData = tabData as BasicTabData;
        switch (basicTabData.title) {
          case "Settings":
            return new SettingsTab();
          case "Welcome":
            return new WelcomeTab();
        }
      }
    }
  }
}

function getAllStateData(): Omit<StateData, "id"> {
  const opened_tabs = tabToTabDataRecursively(
    getRecoil(openedTabsState)
  ) as Array<Array<Array<TabData>>>;

  // The core doesn't support multiple panels yet, because of this, the tabs are flatted for now
  const tmp_opened_tabs = opened_tabs.flat(3) as any;

  return {
    opened_tabs: tmp_opened_tabs,
  };
}

// Opened tabs
export const openedTabsState = atom({
  key: "openedTabs",
  default: [[[]]] as TabsPanels,
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(() => {
        const data = getAllStateData();
        const client = getRecoil(clientState);
        client.set_state_by_id(data);
      });
    },
  ],
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
  default: { row: 0, col: 0, id: null, tab: null },
  dangerouslyAllowMutability: true,
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

// Opened folders in the explorer panel
export const openedFolders = atom<FolderState[]>({
  key: "openedFolders",
  default: [],
});

// Opened windows (popup, prompts...)
export const showedWindows = atom<FloatingWindow[]>({
  key: "showedWindows",
  default: [],
});

// Displayed StatusBar Items
export const showedStatusBarItem = atom<{[key: string]: StatusBarItem}>({
  key: "showedStatusBarItem",
  default: {},
});
