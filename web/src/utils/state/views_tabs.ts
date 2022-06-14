import { atom } from "recoil";
import { Tab } from "../../modules/tab";
import { clientState } from "../state";
import getAllStateData from "../state_data";

export interface ViewPanel<T> {
  selected_tab_id?: string;
  tabs: Array<T>;
}

export type TabsViews<T> = Array<ViewPanel<T>>;

/*
 * Views and tabs openeds
 */
export const openedViewsAndTabs = atom({
  key: "openedViewsAndTabs",
  default: [[{ tabs: [] }]] as Array<TabsViews<Tab>>,
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [
    ({ onSet, getLoadable }) => {
      onSet(() => {
        const data = getAllStateData(
          getLoadable(openedViewsAndTabs).getValue(),
        );
        const client = getLoadable(clientState).getValue();
        client.set_state_by_id(data);
      });
    },
  ],
});
