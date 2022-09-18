import { atom } from "recoil";
import { SidePanel } from "../features/side_panel/side_panel";

// Opened side panels
export const sidePanelsState = atom({
  key: "sidePanels",
  default: [] as Array<SidePanel>,
  dangerouslyAllowMutability: true,
});

// Focused side panel
export const selectedSidePanelState = atom<string | null>({
  key: "selectedSidePanel",
  default: "Explorer",
});
