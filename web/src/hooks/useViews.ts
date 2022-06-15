import { useRecoilState, useSetRecoilState } from "recoil";
import { Popup } from "../modules/popup";
import { Tab } from "../modules/tab";
import { openedViewsAndTabs, showedWindowsState } from "../utils/state";
import { TabsViews } from "../utils/state/views_tabs";
import { FocusedViewPanel, focusedViewPanelState } from "../utils/state/view";
import useTabs, { TabsUtils } from "./useTabs";

function canViewPanelBeClosed(tabs: Tab[]): boolean {
  let canBeClosed = true;
  for (const tab of tabs) {
    if (tab.edited) canBeClosed = false;
  }

  return canBeClosed;
}

function canViewBeClosed(view: TabsViews<Tab>): boolean {
  let canBeClosed = true;

  for (const viewPanel of view) {
    if (!canViewPanelBeClosed(viewPanel.tabs)) canBeClosed = false;
  }

  return canBeClosed;
}

function trySavingTabs(
  tabs: Tab[],
  selectTab: TabsUtils["selectTab"],
  col: number,
  row: number,
): Popup | null {
  let firstEditedTab: Tab | null = null;
  for (const tab of tabs) {
    if (tab.edited && firstEditedTab == null) {
      firstEditedTab = tab;
    }
  }
  if (firstEditedTab) {
    selectTab({
      tab: firstEditedTab,
      col,
      row,
    });
    return firstEditedTab.save();
  }
  return null;
}

/*
 * Utils for views and view panels
 */
export default function useViews() {
  const [tabPanels, setTabPanels] = useRecoilState(openedViewsAndTabs);
  const [focusedView, setFocusedView] = useRecoilState(focusedViewPanelState);
  const setWindows = useSetRecoilState(showedWindowsState);
  const { selectTab } = useTabs();

  const closeViewPanel = ({ col, row }: FocusedViewPanel): boolean => {
    // Always leave at least one view panel opened
    if (tabPanels[row].length === 1) return false;

    // Select the view from above if there is any, or leave the same position focused
    const nextFocusedCol = col > 1 ? col - 1 : 0;

    const canCloseViewPanel = canViewPanelBeClosed(tabPanels[row][col].tabs);

    if (canCloseViewPanel) {
      tabPanels[row].splice(col, 1);
      setTabPanels([...tabPanels]);
      setFocusedView({ col: nextFocusedCol, row });
    } else {
      const popup = trySavingTabs(
        tabPanels[row][col].tabs,
        selectTab,
        col,
        row,
      );
      if (popup != null) {
        setWindows((val) => [...val, popup as Popup]);
      }
    }

    return canCloseViewPanel;
  };

  const closeView = ({ row }: { row: number }): boolean => {
    // Always leave at least one view opened
    if (tabPanels.length == 1) return false;

    // Select the view to the left if there is any, or leave the same position focused
    const nextFocusedRow = row > 0 ? row - 1 : 0;

    const canCloseView = canViewBeClosed(tabPanels[row]);

    if (canCloseView) {
      tabPanels.splice(row, 1);
      setTabPanels([...tabPanels]);
      // Select the first view panel in the new view
      setFocusedView({ col: 0, row: nextFocusedRow });
    } else {
      for (let col = 0; col < tabPanels[row].length; col++) {
        const viewPanel = tabPanels[row][col];
        const popup = trySavingTabs(viewPanel.tabs, selectTab, col, row);
        if (popup != null) {
          setWindows((val) => [...val, popup as Popup]);
        }
      }
    }

    return canCloseView;
  };

  const newViewPanel = ({ row }: { row: number }) => {
    tabPanels[row].push({
      tabs: [],
    });
    setTabPanels([...tabPanels]);
    // Select the latest (new one) view panel from the view
    setFocusedView({ col: tabPanels[row].length - 1, row });
  };

  const newView = ({ afterRow }: { afterRow: number }) => {
    setTabPanels([
      ...tabPanels.slice(0, afterRow),
      [{ tabs: [] }],
      ...tabPanels.slice(afterRow),
    ]);
    setFocusedView({ col: 0, row: afterRow });
  };

  return {
    newView,
    newViewInFocused: () => {
      newView({
        afterRow: focusedView.row + 1,
      });
    },
    closeViewPanel,
    closeFocusedViewPanel: (): boolean => {
      return closeViewPanel(focusedView);
    },
    closeView,
    closeFocusedView: (): boolean => {
      return closeView({ row: focusedView.row });
    },
    newViewPanel,
    newViewPanelInFocused: () => {
      newViewPanel({ row: focusedView.row });
    },
  };
}
