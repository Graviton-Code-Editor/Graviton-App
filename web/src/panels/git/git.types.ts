// Incoming messages from the Git extension

export interface RepoNotFound {
  msg_type: string;
  path: string;
}

export interface Branch {
  msg_type: string;
  path: string;
  name: string;
}

export interface FileStates {
  msg_type: string;
  path: string;
  files_states: FileState<number>[];
}

export type FromExtensionMessage = RepoNotFound | Branch;

// Messages sent to the Git extension

export interface LoadBranch {
  LoadBranch: {
    path: string;
  };
}

export interface LoadFileStates {
  LoadFilesStates: {
    path: string;
  };
}

export type ToExtensionMessage = LoadBranch | LoadFileStates;

// State of a Repository

export interface RepoState {
  branch: string;
  files_states: FileState<FileStatus>[];
}

interface FileState<T> {
  path: string;
  status: T;
}

export interface FileStatus {
  code: number;
  char: string;
}
