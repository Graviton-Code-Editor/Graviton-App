import { SidePanel } from "../../modules/side_panel";
import { ReactSVG } from "react-svg";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { clientState, foldersState } from "../../state/state";
import { MessageFromExtension, NotifyExtension } from "../../types/messaging";
import {
  Branch,
  FileStates,
  FileStatus,
  FromExtensionMessage,
  RepoState,
  ToExtensionMessage,
} from "./git.types";
import { RepoSection } from "../../components/Git/RepoSection";
import styled from "styled-components";
import { SecondaryButton } from "../../components/Primitive/Button";
import HorizontalCentered from "../../components/Primitive/HorizontalCentered";
import { useTranslation } from "react-i18next";
import { openFileSystemPicker } from "../../services/commands";
import { Client } from "../../services/clients/client.types";

function getStatusFlag(code: number): FileStatus {
  // TODO(marc2332): Add more status codes
  switch (code) {
    // Added
    case 512:
      return {
        code,
        char: "A",
      };
    // Modified
    case 256:
      return {
        code,
        char: "M",
      };
    default:
      return {
        code,
        char: "?",
      };
  }
}

function sendMessage(client: Client, message: ToExtensionMessage) {
  client.emitMessage<NotifyExtension>({
    NotifyExtension: {
      msg_type: "ExtensionMessage",
      state_id: client.config.state_id,
      extension_id: "git-for-graviton",
      content: JSON.stringify(message),
    },
  });
}

function GitPanelContainer() {
  const client = useRecoilValue(clientState);
  const [repos, setRepos] = useState<Record<string, RepoState>>({});
  const folders = useRecoilValue(foldersState);
  const setOpenedFolders = useSetRecoilState(foldersState);
  const { t } = useTranslation();

  useEffect(() => {
    folders.forEach((folder) => {
      // Ignore non-local folders
      if (folder.filesystem !== "local") return;
      sendMessage(client, {
        LoadBranch: {
          path: folder.path,
        },
      });
    });

    const cancelListener = client.on(
      "MessageFromExtension",
      (ev: MessageFromExtension) => {
        try {
          const message: FromExtensionMessage = JSON.parse(ev.message);
          switch (message.msg_type) {
            // Show the active branch
            case "Branch": {
              const content = message as Branch;
              setRepos((repos) => {
                const repo = repos[content.path] ?? {
                  files_states: [],
                };
                return {
                  ...repos,
                  [content.path]: {
                    ...repo,
                    branch: content.name,
                  },
                };
              });

              sendMessage(client, {
                LoadFilesStates: {
                  path: content.path,
                },
              });
              break;
            }
            // Show the files states
            case "FilesState": {
              const content = message as FileStates;
              setRepos((repos) => {
                const repo = repos[content.path];
                return {
                  ...repos,
                  [content.path]: {
                    ...repo,
                    files_states: content.files_states.map((file) => ({
                      ...file,
                      status: getStatusFlag(file.status),
                    })),
                  },
                };
              });
              break;
            }
            case "RepoNotFound": {
              break;
            }
          }
        } catch {
          /**/
        }
      },
    );
    return () => {
      cancelListener();
    };
  }, [client, folders]);

  // Remove branches from folders not opened anymore
  useEffect(() => {
    for (const path of Object.keys(repos)) {
      let folderExists = false;
      for (const folder of folders) {
        if (folder.path === path) {
          folderExists = true;
        }
      }

      if (!folderExists) {
        delete repos[path];
        setRepos({ ...repos });
      }
    }
  }, [folders]);

  async function openFolder() {
    const openedFolder = await openFileSystemPicker("local", "folder");
    // If a folder selected
    if (openedFolder != null) {
      // Clear all opened folders and open the selected one
      setOpenedFolders([
        {
          path: openedFolder,
          filesystem: "local",
        },
      ]);
    }
  }

  function fetchRepoState(repoPath: string) {
    sendMessage(client, {
      LoadBranch: {
        path: repoPath,
      },
    });
  }

  return (
    <>
      {folders.length == 0
        ? (
          <HorizontalCentered>
            <SecondaryButton
              expanded={true}
              onClick={openFolder}
              style={{ "marginLeft": 5 }}
            >
              {t("prompts.Global.OpenFolder")}
            </SecondaryButton>
          </HorizontalCentered>
        )
        : (
          Object.keys(repos).map((path) => {
            return (
              <RepoSection
                key={path}
                path={path}
                state={repos[path]}
                fetchRepoState={() => fetchRepoState(path)}
              />
            );
          })
        )}
    </>
  );
}

const GitIcon = styled(ReactSVG)`
  & svg {
    height: 25px;
  }
  & circle {
    stroke: var(--sidebarButtonFill);
    fill: #31363C;
  }
  & path, rect {
    fill: var(--sidebarButtonFill);
  }
`;

export default class GitPanel extends SidePanel {
  private callback = () => {/**/};

  constructor() {
    super("Git");
    this.icon = () => <GitIcon src="/icons/git.svg" />;
  }

  container = GitPanelContainer;

  public focus() {
    this.callback();
  }
}
