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

export type FromExtensionMessage = RepoNotFound | Branch;

// Mmessages sent to the Git extension

export interface LoadBranch {
  path: string;
}
