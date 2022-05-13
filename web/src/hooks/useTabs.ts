import { useRecoilState, useSetRecoilState } from "recoil";
import { Tab } from "../modules/tab";
import { tabsState } from "../utils/state";
import { focusedTabState } from "../utils/state/tabs";
import { focusedViewPanelState } from "../utils/state/views";

interface TabsUtils {
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
  const [tabPanels, setTabPanels] = useRecoilState(tabsState);
  const [focusedView, setFocusedView] = useRecoilState(focusedViewPanelState);
  const setFocusedTab = useSetRecoilState(focusedTabState);

  return {
    openTab: (newTab) => {
      const { col, row } = focusedView;
      // Push the new tab
      tabPanels[row][col].tabs = [...tabPanels[row][col].tabs, newTab];
      setTabPanels([...tabPanels]);

      // Select the new tab
      tabPanels[row][col].selected_tab_id = newTab?.id;
      setTabPanels([...tabPanels]);
    },
    selectTab: ({ tab, col, row }) => {
      tabPanels[row][col].selected_tab_id = tab?.id;
      setTabPanels([...tabPanels]);
      setFocusedView({ col, row });
    },
    focusTab: ({ tab, col, row }) => {
      setFocusedTab({ col, row, tab, id: tab ? tab.id : null });
      setFocusedView({ col, row });
    },
  };
}
