import { atom } from "recoil";
import { Panel } from "../../modules/panel";

export interface PanelState {
  panel: Panel;
}

// Opened panels
export const panelsState = atom({
  key: "panels",
  default: [] as Array<PanelState>,
});
