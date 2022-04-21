import { getRecoil } from "recoil-nexus";
import { Tab, TabData } from "../../modules/tab";
import { tabsState, TabsViews } from "./tabs";

export interface StateData {
  id: number;
  opened_tabs: Array<TabsViews<TabData>>;
}

export default function getAllStateData(): Omit<StateData, "id"> {
  const opened_tabs = transformTabsToData(getRecoil(tabsState));

  return {
    opened_tabs,
  };
}

// Transform Tabs to TabDatas
function transformTabsToData(
  views: Array<TabsViews<Tab>>
): Array<TabsViews<TabData>> {
  return views.map((viewPanel) => {
    return viewPanel.map((view) => {
      return {
        focused_tab_id: view.focused_tab_id,
        tabs: view.tabs.map((tab) => {
          return tab.toJson();
        }),
      };
    });
  });
}
