import { useRecoilState } from "recoil";
import { SidePanel } from "../modules/side_panel";
import { sidePanelsState } from "../state/state";
import { selectedSidePanelState } from "../state/side_panels";

export default function useSidePanels() {
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
