import { useRecoilState } from "recoil";
import { SidePanel } from "../features/side_panel/side_panel";
import { selectedSidePanelState, sidePanelsState } from "state";

export function useSidePanels() {
  const [sidePanels, setSidePanels] = useRecoilState(sidePanelsState);
  const [selectedSidePanelName, setSelectedSidePanelName] = useRecoilState(
    selectedSidePanelState,
  );

  return {
    sidePanels,
    selectedSidePanelName,
    selectSidePanel(name: string) {
      setSelectedSidePanelName(name);
    },
    focusSelectedSidePanel() {
      for (const panel of sidePanels) {
        if (panel.name === selectedSidePanelName) {
          panel.focus();
        }
      }
    },
    pushSidePanel(panel: SidePanel) {
      setSidePanels((panels) => [...panels, panel]);
    },
  };
}
