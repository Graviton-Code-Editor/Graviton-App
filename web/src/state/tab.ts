import { atom } from "recoil";
import { Tab } from "../features/tab/tab";

export interface FocusedTab {
  row: number;
  col: number;
  id: string | null;
  tab: Tab | null;
}

// Current focused (clicked) tab
export const focusedTabState = atom<FocusedTab>({
  key: "focusedTab",
  default: { row: 0, col: 0, id: null, tab: null },
  dangerouslyAllowMutability: true,
});
