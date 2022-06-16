import { useRecoilState, useSetRecoilState } from "recoil";
import { Popup } from "../modules/popup";
import { Tab } from "../modules/tab";
import { openedViewsAndTabs, showedWindowsState } from "../utils/state";
import { FocusedTab, focusedTabState } from "../utils/state/tab";
import { FocusedViewPanel, focusedViewPanelState } from "../utils/state/view";
import { TabsViews } from "../utils/state/views_tabs";

export interface TabsUtils {
  viewsAndTabs: TabsViews<Tab>[];
  focusedTab: FocusedTab;
  focusedView: FocusedViewPanel;
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
  closeTab: ({
    tab,
    col,
    row,
    force,
  }: {
    tab: Tab;
    col: number;
    row: number;
    force: boolean;
  }) => void;
  closeFocusedTab: () => void;
  saveFocusedTab: () => void;
}

/**
 * Utils for Tabs
 */
export default function useTabs(): TabsUtils {
  const [viewsAndTabs, setViewsAndTabs] = useRecoilState(openedViewsAndTabs);
  const [focusedView, setFocusedView] = useRecoilState(focusedViewPanelState);
  const [focusedTab, setFocusedTab] = useRecoilState(focusedTabState);
  const setWindows = useSetRecoilState(showedWindowsState);

  const closeTab: TabsUtils["closeTab"] = ({ tab, col, row, force }) => {
    if (tab.edited && force === false) {
      selectTab({
        tab,
        col,
        row,
      });
      const popup = tab.save();
      if (popup != null) {
        setWindows((val) => [...val, popup as Popup]);
      }
      return;
    }

    // Notify the tab
    tab.close();

    // Remove it
    const index = viewsAndTabs[row][col].tabs.indexOf(tab);
    viewsAndTabs[row][col].tabs.splice(index, 1);

    // Select another tab if necessary
    if (viewsAndTabs[row][col].selected_tab_id === tab.id) {
      const newTab = viewsAndTabs[row][col].tabs[index - 1];
      if (newTab) {
        viewsAndTabs[row][col].selected_tab_id = newTab.id;
        setFocusedTab({ col, row, tab: newTab, id: newTab.id });
      } else {
        viewsAndTabs[row][col].selected_tab_id = undefined;
        setFocusedTab({ col, row, tab: null, id: null });
      }
    }

    setViewsAndTabs([...viewsAndTabs]);
    setFocusedView({ col, row });
  };

  const selectTab: TabsUtils["selectTab"] = ({ col, row, tab }) => {
    viewsAndTabs[row][col].selected_tab_id = tab?.id;
    setViewsAndTabs([...viewsAndTabs]);
    setFocusedView({ col, row });
  };

  return {
    viewsAndTabs,
    focusedTab,
    focusedView,
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
    selectTab,
    focusTab: ({ tab, col, row }) => {
      setFocusedTab({ col, row, tab, id: tab ? tab.id : null });
      setFocusedView({ col, row });
    },
    closeTab,
    closeFocusedTab: () => {
      if (focusedTab.tab != null) {
        closeTab({
          ...focusedTab,
          tab: focusedTab.tab,
          force: false,
        });
      }
    },
    saveFocusedTab() {
      focusedTab.tab?.save({ force: true });
    },
  };
}
