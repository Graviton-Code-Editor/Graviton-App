import { useRecoilState, useSetRecoilState } from "recoil";
import { Popup } from "../modules/popup";
import { Tab } from "../modules/tab";
import { openedViewsAndTabs, showedWindowsState } from "../state/state";
import { FocusedTab, focusedTabState } from "../state/tab";
import { FocusedViewPanel, focusedViewPanelState } from "../state/view";
import { Views } from "../state/views_tabs";

export interface TabsUtils {
  viewsAndTabs: Views<Tab>[];
  focusedTab: FocusedTab;
  focusedView: FocusedViewPanel;
  openTab: (newTab: Tab) => void;
  selectTab: (ops: {
    tab: Tab | null;
    col: number;
    row: number;
  }) => void;
  focusTab: (ops: {
    tab: Tab | null;
    col: number;
    row: number;
  }) => void;
  closeTab: (ops: {
    tab: Tab;
    col: number;
    row: number;
  }) => void;
  closeFocusedTab: () => void;
  saveTab: (
    ops: { tab: Tab; force: boolean; col: number; row: number },
  ) => void;
  saveFocusedTab: () => void;
  setTabEdited: (tab: Tab, state: boolean) => void;
}

/**
 * Utils for Tabs
 */
export default function useTabs(): TabsUtils {
  const [viewsAndTabs, setViewsAndTabs] = useRecoilState(openedViewsAndTabs);
  const [focusedView, setFocusedView] = useRecoilState(focusedViewPanelState);
  const [focusedTab, setFocusedTab] = useRecoilState(focusedTabState);
  const setWindows = useSetRecoilState(showedWindowsState);

  const closeTab: TabsUtils["closeTab"] = ({ tab, col, row }) => {
    // Notify the tab
    tab.close();

    // Remove it
    const index = viewsAndTabs[row].view_panels[col].tabs.indexOf(tab);
    viewsAndTabs[row].view_panels[col].tabs.splice(index, 1);

    // Select another tab if necessary
    if (viewsAndTabs[row].view_panels[col].selected_tab_id === tab.id) {
      const newTab = viewsAndTabs[row].view_panels[col].tabs[index - 1];
      if (newTab) {
        viewsAndTabs[row].view_panels[col].selected_tab_id = newTab.id;
        setFocusedTab({ col, row, tab: newTab, id: newTab.id });
      } else {
        viewsAndTabs[row].view_panels[col].selected_tab_id = undefined;
        setFocusedTab({ col, row, tab: null, id: null });
      }
    }

    setViewsAndTabs([...viewsAndTabs]);
    setFocusedView({ col, row });
  };

  const selectTab: TabsUtils["selectTab"] = ({ col, row, tab }) => {
    viewsAndTabs[row].view_panels[col].selected_tab_id = tab?.id;
    setViewsAndTabs([...viewsAndTabs]);
    setFocusedView({ col, row });
  };

  const saveTab: TabsUtils["saveTab"] = ({ tab, force, col, row }) => {
    const close = () => closeTab({ tab, col, row });
    const setEdited = (state: boolean) => setTabEdited(tab, state);

    // For better UX, make the tab visible if it isn't
    selectTab(focusedTab);

    const popup = tab.save({ force, close, setEdited });

    // Display the popup returned by the tab if there isn't
    if (popup != null) {
      setWindows((val) => [...val, popup as Popup]);
    }
  };

  const setTabEdited: TabsUtils["setTabEdited"] = (tab, state) => {
    tab.edited = state;
    setViewsAndTabs((v) => [...v]);
  };

  return {
    viewsAndTabs,
    focusedTab,
    focusedView,
    openTab: (newTab) => {
      const { col, row } = focusedView;
      // Push the new tab
      viewsAndTabs[row].view_panels[col].tabs = [
        ...viewsAndTabs[row].view_panels[col].tabs,
        newTab,
      ];
      setViewsAndTabs([...viewsAndTabs]);

      // Select the new tab
      viewsAndTabs[row].view_panels[col].selected_tab_id = newTab?.id;
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
        saveTab({ ...focusedTab, tab: focusedTab.tab, force: false });
        closeTab({
          ...focusedTab,
          tab: focusedTab.tab,
        });
      }
    },
    saveTab,
    saveFocusedTab() {
      if (focusedTab.tab) {
        saveTab({ ...focusedTab, tab: focusedTab.tab, force: true });
      }
    },
    setTabEdited,
  };
}
