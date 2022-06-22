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
import { newId } from "./id";
import { CommandConfig } from "./state/commands";
import { ViewPanel, Views } from "./state/views_tabs";

// Serialized State
export interface StateData {
  id: number;
  views: Array<ViewsData>;
  commands: Record<string, CommandConfig>;
}

// Serialized Data of a View Panel
export type ViewPanelData = Omit<ViewPanel<TabData>, "id">;

// Serialized Data of a View
export interface ViewsData {
  view_panels: Array<ViewPanelData>;
}

// Serialize a State
export default function getAllStateData(
  raw_views: Views<Tab>[],
  commands: Record<string, CommandConfig>,
): Omit<StateData, "id"> {
  const views = serializeViews(raw_views);

  return {
    views,
    commands,
  };
}

// Transform Tabs to TabDatas
function serializeViews(
  views: Array<Views<Tab>>,
): Array<ViewsData> {
  return views.map(({ view_panels }) => {
    return {
      view_panels: view_panels.map((view) => {
        return {
          selected_tab_id: view.selected_tab_id,
          tabs: view.tabs.map((tab) => {
            return tab.toJson();
          }),
        };
      }),
    };
  });
}

// Transform TabDatas to Tabs
export function deserializeViews(
  views: Array<ViewsData>,
  getEditor: EditorFinder,
  client: Client,
): Array<Views<undefined | TextEditorTab | Tab>> {
  return views.map(({ view_panels }) => {
    return {
      id: newId(),
      view_panels: view_panels.map((viewPanel) => {
        return {
          id: newId(),
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
      }),
    };
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
