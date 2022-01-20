import { TabData } from "../modules/tab";

export type TabsDataPanels = Array<Array<Array<TabData>>>;

export interface StateData {
  id: number;
  opened_tabs: TabsDataPanels;
}
