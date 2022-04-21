import { useRecoilState, useSetRecoilState } from "recoil";
import { Tab } from "../modules/tab";
import { tabsState } from "../utils/state";
import { focusedTabState } from "../utils/state/tabs";

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
 * Easily open a new tab
 */
export default function useTabs(): TabsUtils {
  const [tabPanels, setTabPanels] = useRecoilState(tabsState);
  const setFocusedTab = useSetRecoilState(focusedTabState);

  return {
    openTab: (newTab) => {
      // Push the new tab
      tabPanels[0][0].tabs = [...tabPanels[0][0].tabs, newTab];
      setTabPanels([...tabPanels]);

      // Select the new tab
      tabPanels[0][0].selected_tab_id = newTab?.id;
      setTabPanels([...tabPanels]);
    },
    selectTab: ({ tab, col, row }) => {
      tabPanels[row][col].selected_tab_id = tab?.id;
      setTabPanels([...tabPanels]);
    },
    focusTab: ({ tab, col, row }) => {
      setFocusedTab({ col, row, tab, id: tab ? tab.id : null });
    },
  };
}
