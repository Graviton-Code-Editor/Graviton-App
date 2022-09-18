import { useRecoilState } from "recoil";
import { Popup } from "../features/popup/popup";
import { Tab } from "../features/tab/tab";
import { newEmptyView, openedViewsAndTabs, Views } from "../state/views_tabs";
import { FocusedViewPanel, focusedViewPanelState } from "../state/view";
import { TabsUtils, useTabs } from "hooks";
import { newId } from "../utils/id";

function canViewPanelBeClosed(tabs: Tab[]): boolean {
  let canBeClosed = true;
  for (const tab of tabs) {
    if (tab.edited) canBeClosed = false;
  }
  return canBeClosed;
}

function canViewBeClosed(view: Views<Tab>): boolean {
  let canBeClosed = true;

  for (const viewPanel of view.view_panels) {
    if (!canViewPanelBeClosed(viewPanel.tabs)) canBeClosed = false;
  }

  return canBeClosed;
}

function trySavingTabs(
  tabs: Tab[],
  saveTab: TabsUtils["saveTab"],
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
    saveTab({ tab: firstEditedTab, force: false, col, row });
  }
  return null;
}

/*
 * Utils for views and view panels
 */
export function useViews() {
  const [tabPanels, setTabPanels] = useRecoilState(openedViewsAndTabs);
  const [focusedView, setFocusedView] = useRecoilState(focusedViewPanelState);
  const { saveTab } = useTabs();

  const closeViewPanelForcefully = (
    { col, row }: FocusedViewPanel,
  ): boolean => {
    // Select the view from above if there is any, or leave the same position focused
    const nextFocusedCol = col > 1 ? col - 1 : 0;

    const canCloseViewPanel = canViewPanelBeClosed(
      tabPanels[row].view_panels[col].tabs,
    );

    if (canCloseViewPanel) {
      tabPanels[row].view_panels.splice(col, 1);
      setTabPanels([...tabPanels]);
      setFocusedView({ col: nextFocusedCol, row });
    } else {
      trySavingTabs(
        tabPanels[row].view_panels[col].tabs,
        saveTab,
        col,
        row,
      );
    }

    return canCloseViewPanel;
  };

  const closeViewPanel = ({ col, row }: FocusedViewPanel): boolean => {
    // Always leave at least one view panel opened
    if (tabPanels[row].view_panels.length === 1) return false;

    return closeViewPanelForcefully({ col, row });
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
      for (let col = 0; col < tabPanels[row].view_panels.length; col++) {
        const viewPanel = tabPanels[row].view_panels[col];
        trySavingTabs(viewPanel.tabs, saveTab, col, row);
      }
    }

    return canCloseView;
  };

  const closeViewPanelAndView = ({ col, row }: FocusedViewPanel): boolean => {
    if (tabPanels[row].view_panels.length == 1) {
      if (tabPanels.length > 1) {
        return closeView({ row });
      } else {
        return false;
      }
    } else {
      return closeViewPanelForcefully({ col, row });
    }
  };

  const newViewPanel = ({ row }: { row: number }) => {
    tabPanels[row].view_panels.push({
      id: newId(),
      tabs: [],
    });
    setTabPanels([...tabPanels]);
    // Select the latest (new one) view panel from the view
    setFocusedView({ col: tabPanels[row].view_panels.length - 1, row });
  };

  const newView = ({ afterRow }: { afterRow: number }) => {
    setTabPanels([
      ...tabPanels.slice(0, afterRow),
      newEmptyView(),
      ...tabPanels.slice(afterRow),
    ]);
    setFocusedView({ col: 0, row: afterRow });
  };

  return {
    tabPanels,
    focusedView,
    newView,
    newViewInFocused: () => {
      newView({
        afterRow: focusedView.row + 1,
      });
    },
    closeViewPanel,
    closeFocusedViewPanel: (): boolean => {
      return closeViewPanelAndView(focusedView);
    },
    closeViewPanelAndView,
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
