import { Loadable, RecoilValue } from "recoil";
import {
  Client,
  CoreResponse,
  FileInfo,
} from "../services/clients/client.types";
import { SettingsTab, TextEditorTab, WelcomeTab } from "tabs";
import { newId } from "../utils/id";
import { CommandConfig, commandsState } from "./commands";
import { openedViewsAndTabs, ViewPanel, Views } from "./views_tabs";
import { clientState } from "./state";
import {
  BasicTabData,
  Tab,
  TabData,
  TextEditorTabData,
} from "../features/tab/tab";
import { EditorFinder } from "../hooks/useEditor";

/**
 * Serializes the value of different States into A StateData
 * and sends it to the Core via the Client
 */
export function persistState(
  getLoadable: <S>(v: RecoilValue<S>) => Loadable<S>,
) {
  const data = getAllStateData(
    getLoadable(openedViewsAndTabs).getValue(),
    getLoadable(commandsState).getValue(),
  );

  const client = getLoadable(clientState).getValue();
  client.set_state_by_id(data);
}

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
export function serializeViews(
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
        const tabs: Tab[] = [];

        viewPanel.tabs.forEach((tabData) => {
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
                tabs.push(tab);
              }
              break;
            }
            default: {
              const basicTabData = tabData as BasicTabData;
              switch (basicTabData.title) {
                case "Settings": {
                  const settingsTab = new SettingsTab();
                  settingsTab.id = basicTabData.id;
                  tabs.push(settingsTab);
                  break;
                }
                case "Welcome": {
                  const welcomeTab = new WelcomeTab();
                  welcomeTab.id = tabData.id;
                  tabs.push(welcomeTab);
                  break;
                }
                // TODO(marc2332) Support Terminal tabs?
                default:
                  // Unselect the tab if it's not supported
                  if (viewPanel.selected_tab_id === tabData.id) {
                    viewPanel.selected_tab_id = undefined;
                  }
              }
            }
          }
        });

        return {
          id: newId(),
          selected_tab_id: viewPanel.selected_tab_id,
          tabs,
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
