import { useRecoilState } from "recoil";
import { tabsState } from "../utils/state";
import { FocusedViewPanel, focusedViewPanelState } from "../utils/state/views";

interface ViewUtils {
  newView: () => void;
  closeViewPanel: (view: FocusedViewPanel) => void;
  closeFocusedViewPanel: () => void;
  closeView: ({ row }: { row: number }) => void;
  closeFocusedView: () => void;
  newViewPanel: ({ row }: { row: number }) => void;
  newViewPanelInFocused: () => void;
}

/*
 * Utils for views and view panels
 */
export default function useViews(): ViewUtils {
  const [tabPanels, setTabPanels] = useRecoilState(tabsState);
  const [focusedView, setFocusedView] = useRecoilState(focusedViewPanelState);

  // TODO(marc2332): This should somehow check for the tabs state, just to make sure they are all saved, and if not, prompt the user to do it
  const closeViewPanel = ({ col, row }: FocusedViewPanel) => {
    // Always leave at least one view panel opened
    if (tabPanels[row].length === 1) return;

    const nextFocusedCol = col > 1 ? col - 1 : 0;

    tabPanels[row].splice(col, 1);
    setTabPanels([...tabPanels]);
    setFocusedView({ col: nextFocusedCol, row });
  };

  const closeView = ({ row }: { row: number }) => {
    // Always leave at least one view opened
    if (tabPanels.length == 1) return;

    const nextFocusedRow = row > 0 ? row - 1 : 0;

    tabPanels.splice(row, 1);
    setTabPanels([...tabPanels]);
    setFocusedView({ col: tabPanels.length - 1, row: nextFocusedRow });
  };

  const newViewPanel = ({ row }: { row: number }) => {
    tabPanels[focusedView.row].push({
      tabs: [],
    });
    setTabPanels([...tabPanels]);
    setFocusedView({ col: tabPanels.length - 1, row });
  };

  return {
    newView: () => {
      tabPanels.push([{ tabs: [] }]);
      setTabPanels([...tabPanels]);
      setFocusedView({ col: 0, row: tabPanels.length - 1 });
    },
    closeViewPanel,
    closeFocusedViewPanel: () => {
      closeViewPanel(focusedView);
    },
    closeView,
    closeFocusedView: () => {
      closeView({ row: focusedView.row });
    },
    newViewPanel,
    newViewPanelInFocused: () => {
      newViewPanel({ row: focusedView.row });
    },
  };
}
