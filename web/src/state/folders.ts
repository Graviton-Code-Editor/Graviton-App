import { atom } from "recoil";

export interface FolderState {
  path: string;
  filesystem: string;
}

// Opened folders in the explorer panel
export const foldersState = atom<FolderState[]>({
  key: "openedFolders",
  default: [],
});
