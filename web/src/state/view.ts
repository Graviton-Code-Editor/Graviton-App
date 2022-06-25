import { atom } from "recoil";

export interface FocusedViewPanel {
  row: number;
  col: number;
}

export const focusedViewPanelState = atom<FocusedViewPanel>({
  key: "focusedViewPanel",
  default: { row: 0, col: 0 },
  dangerouslyAllowMutability: true,
});
