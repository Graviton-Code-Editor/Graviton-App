import { ShowPopup, StateUpdated } from "types";
import Emittery from "emittery";
import Configuration from "utils/config";
import { StateData } from "state";

export interface BaseMessage {
  state_id: number;
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

export interface ManifestExtension {
  name: string;
  id: string;
  author: string;
  version: string;
  repository: string;
  main: string | null;
}
export interface ManifestInfo {
  extension: ManifestExtension;
}

export interface LanguageServer {
  name: string;
  id: string;
  extension_id: string;
}

export interface TerminalShellBuilderInfo {
  name: string;
  id: string;
}

export interface Client extends Emittery {
  config: Configuration<string | null>;
  get_state_by_id: () => Promise<CoreResponse<StateData>>;
  set_state_by_id: (state: Omit<StateData, "id">) => Promise<void>;
  read_file_by_path: (
    path: string,
    fs: string,
  ) => Promise<CoreResponse<FileInfo>>;
  write_file_by_path: (
    path: string,
    content: string,
    fs: string,
  ) => Promise<CoreResponse<never>>;
  list_dir_by_path: (
    path: string,
    fs: string,
  ) => Promise<CoreResponse<Array<DirItemInfo>>>;
  get_ext_info_by_id: (
    extensionId: string,
  ) => Promise<CoreResponse<ManifestInfo>>;
  get_ext_list: () => Promise<CoreResponse<string[]>>;
  listenToState: () => void;
  whenConnected: () => Promise<void>;
  get_all_language_server_builders: () => Promise<
    CoreResponse<Array<LanguageServer>>
  >;
  emitMessage: <T>(message: T) => Promise<void>;
  get_terminal_shell_builders: () => Promise<
    CoreResponse<TerminalShellBuilderInfo[]>
  >;
  write_to_terminal_shell: (
    terminal_shell_id: string,
    data: string,
  ) => Promise<CoreResponse<never>>;
  close_terminal_shell: (
    terminal_shell_id: string,
  ) => Promise<CoreResponse<never>>;
  create_terminal_shell: (
    terminal_shell_builder_id: string,
    terminal_shell_id: string,
  ) => Promise<CoreResponse<never>>;
  resize_terminal_shell: (
    terminal_shell_id: string,
    cols: number,
    rows: number,
  ) => Promise<CoreResponse<never>>;
  create_language_server: (
    language_server_builder_id: string,
  ) => Promise<CoreResponse<never>>;
  write_to_language_server: (
    language_server_id: string,
    data: string,
  ) => Promise<CoreResponse<never>>;
}

export type EventsInterface = Record<
  string,
  {
    ShowPopup: ShowPopup;
    ListenToState: StateUpdated;
    connected: null;
  } | null
>;
