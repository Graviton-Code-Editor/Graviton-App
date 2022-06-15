import { useRecoilState, useSetRecoilState } from "recoil";
import { Tab } from "../modules/tab";
import { openedViewsAndTabs } from "../utils/state";
import { focusedTabState } from "../utils/state/tab";
import { focusedViewPanelState } from "../utils/state/view";
import { TabsViews } from "../utils/state/views_tabs";

export interface TabsUtils {
  viewsAndTabs: TabsViews<Tab>[];
  openTab: (newTab: Tab) => void;
  selectTab: ({
    tab,
    col,
    row,
  }: {
    tab: Tab | null;
    col: number;
    row: number;
  }) => void;
  focusTab: ({
    tab,
    col,
    row,
  }: {
    tab: Tab | null;
    col: number;
    row: number;
  }) => void;
}

/**
 * Utils for Tabs
 */
export default function useTabs(): TabsUtils {
  const [viewsAndTabs, setViewsAndTabs] = useRecoilState(openedViewsAndTabs);
  const [focusedView, setFocusedView] = useRecoilState(focusedViewPanelState);
  const setFocusedTab = useSetRecoilState(focusedTabState);

  return {
    viewsAndTabs,
    openTab: (newTab) => {
      const { col, row } = focusedView;
      // Push the new tab
      viewsAndTabs[row][col].tabs = [...viewsAndTabs[row][col].tabs, newTab];
      setViewsAndTabs([...viewsAndTabs]);

      // Select the new tab
      viewsAndTabs[row][col].selected_tab_id = newTab?.id;
      setViewsAndTabs([...viewsAndTabs]);

      setFocusedTab({ col, row, tab: newTab, id: newTab ? newTab.id : null });
      setFocusedView({ col, row });
    },
    selectTab: ({ tab, col, row }) => {
      viewsAndTabs[row][col].selected_tab_id = tab?.id;
      setViewsAndTabs([...viewsAndTabs]);
      setFocusedView({ col, row });
    },
    focusTab: ({ tab, col, row }) => {
      setFocusedTab({ col, row, tab, id: tab ? tab.id : null });
      setFocusedView({ col, row });
    },
  };
}
