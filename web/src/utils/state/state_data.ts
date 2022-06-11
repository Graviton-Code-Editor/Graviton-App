import { Tab, TabData } from "../../modules/tab";
import { TabsViews } from "./tabs";

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
