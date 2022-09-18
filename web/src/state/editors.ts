import { atom } from "recoil";
import { TextEditorTab } from "tabs";

// Registed Editors implementations
export const editors = atom<typeof TextEditorTab[]>({
  key: "editors",
  default: [TextEditorTab],
});
