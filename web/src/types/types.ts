import { Panel } from "../modules/panel";
import { Tab } from "../modules/tab";

export interface EditorInterface {
  name: string;
  /*
   * Sabe the state of the editor
   */
  save: () => void;
}
export interface FocusedTab {
  row: number;
  col: number;
  id: string | null;
}

export interface PanelState {
  panel: Panel;
}

export type TabsPanels = Array<Array<Array<Tab>>>;

export interface FolderState {
  path: string;
  //filesystem: string
}
