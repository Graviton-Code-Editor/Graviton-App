import { EditorFinder } from "../hooks/useEditor";
import { BasicTabData, Tab, TabData, TextEditorTabData } from "../modules/tab";
import {
  Client,
  CoreResponse,
  FileInfo,
} from "../services/clients/client.types";
import SettingsTab from "../tabs/settings";
import TextEditorTab from "../tabs/text_editor/text_editor";
import WelcomeTab from "../tabs/welcome";
import { TabsViews } from "./state/views_tabs";

export interface StateData {
  id: number;
  opened_tabs: Array<TabsViews<TabData>>;
}

export default function getAllStateData(
  views: TabsViews<Tab>[],
): Omit<StateData, "id"> {
  const opened_tabs = transformTabsToData(views);

  return {
    opened_tabs,
  };
}

// Transform Tabs to TabDatas
function transformTabsToData(
  views: Array<TabsViews<Tab>>,
): Array<TabsViews<TabData>> {
  return views.map((viewPanel) => {
    return viewPanel.map((view) => {
      return {
        selected_tab_id: view.selected_tab_id,
        tabs: view.tabs.map((tab) => {
          return tab.toJson();
        }),
      };
    });
  });
}

// Transform TabDatas to Tabs
export function transformTabsDataToTabs(
  views: Array<TabsViews<TabData>>,
  getEditor: EditorFinder,
  client: Client,
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
                const tabContentReader = client.read_file_by_path(
                  data.path,
                  data.filesystem,
                );
                const tab = new editor(
                  data.filename,
                  data.path,
                  toContentResolver(tabContentReader),
                  data.format,
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

async function toContentResolver(
  reader: Promise<CoreResponse<FileInfo>>,
): Promise<string | null> {
  const res = await reader;
  if (res.Ok) {
    return res.Ok.content;
  } else {
    return null;
  }
}
