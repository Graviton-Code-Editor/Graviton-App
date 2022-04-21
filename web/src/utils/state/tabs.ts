import { atom } from "recoil";
import { getRecoil } from "recoil-nexus";
import { EditorFinder } from "../../hooks/useEditor";
import {
  BasicTabData,
  Tab,
  TabData,
  TextEditorTabData,
} from "../../modules/tab";
import SettingsTab from "../../tabs/settings";
import TextEditorTab from "../../tabs/text_editor";
import WelcomeTab from "../../tabs/welcome";
import { clientState } from "../state";
import getAllStateData from "./state_data";

export interface ViewPanel<T> {
  selected_tab_id?: string;
  tabs: Array<T>;
}

export type TabsViews<T> = Array<ViewPanel<T>>;

// Transform TabDatas to Tabs
export function transformTabsDataToTabs(
  views: Array<TabsViews<TabData>>,
  getEditor: EditorFinder
): Array<TabsViews<undefined | TextEditorTab | Tab>> {
  return views.map((viewPanel) => {
    return viewPanel.map((viewPanel) => {
      return {
        selected_tab_id: viewPanel.selected_tab_id,
        tabs: viewPanel.tabs.map((tabData) => {
          switch (tabData.tab_type) {
            case "TextEditor": {
              const data = tabData as TextEditorTabData;
              const editor = getEditor(data.format);
              if (editor != null) {
                const tab = new editor(
                  data.filename,
                  data.path,
                  data.content,
                  data.format
                );
                tab.id = tabData.id;
                return tab;
              }
              break;
            }
            default: {
              const basicTabData = tabData as BasicTabData;
              switch (basicTabData.title) {
                case "Settings": {
                  const settingsTab = new SettingsTab();
                  settingsTab.id = basicTabData.id;
                  return settingsTab;
                }
                case "Welcome": {
                  const welcomeTab = new WelcomeTab();
                  welcomeTab.id = tabData.id;
                  return welcomeTab;
                }
              }
            }
          }
        }),
      };
    });
  });
}

// Opened tabs
export const tabsState = atom({
  key: "openedTabs",
  default: [[{ tabs: [] }]] as Array<TabsViews<Tab>>,
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

export interface FocusedTab {
  row: number;
  col: number;
  id: string | null;
  tab: Tab | null;
}

// Current focused (clicked) tab
export const focusedTabState = atom<FocusedTab>({
  key: "focusedTab",
  default: { row: 0, col: 0, id: null, tab: null },
  dangerouslyAllowMutability: true,
});
