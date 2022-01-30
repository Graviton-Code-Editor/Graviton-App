import { ShowPopup, StateUpdated } from "./messages";
import Emittery from "emittery";
import { StateData } from "../utils/state";

export interface BaseMessage {
  state_id: number;
  trigger: string;
  msg_type: string;
}
export interface CoreResponse<T> {
  Err?: any;
  Ok?: T;
}

export interface DirItemInfo {
  path: string;
  name: string;
  is_file: boolean;
}

export interface FileFormatText {
  Text: string;
}

export type FileFormat = "Unknown" | "Binary" | FileFormatText;
export interface FileInfo {
  content: string;
  format: FileFormat;
}

export interface ExtensionInfo {
  name: string;
  id: string;
}

export interface Client extends Emittery {
  get_state_by_id: () => Promise<StateData>;
  set_state_by_id: (state: Omit<StateData, "id">) => Promise<void>;
  read_file_by_path: (
    path: string,
    fs: string
  ) => Promise<CoreResponse<FileInfo>>;
  write_file_by_path: (
    path: string,
    content: string,
    fs: string
  ) => Promise<CoreResponse<never>>;
  list_dir_by_path: (
    path: string,
    fs: string
  ) => Promise<CoreResponse<Array<DirItemInfo>>>;
  get_ext_info_by_id: (
    extensionId: string
  ) => Promise<CoreResponse<ExtensionInfo>>;
  get_ext_list_by_id: () => Promise<CoreResponse<string[]>>;
  listenToState: () => void;
  whenConnected: () => Promise<void>;
}

export type EventsInterface = Record<
  string,
  {
    ShowPopup: ShowPopup;
    ListenToState: StateUpdated;
    connected: null;
  } | null
>;
