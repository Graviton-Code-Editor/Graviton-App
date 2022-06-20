import { SidePanel } from "../../modules/side_panel";
import { ReactSVG } from "react-svg";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { clientState, foldersState } from "../../utils/state";
import { MessageFromExtension, NotifyExtension } from "../../types/messaging";
import { Branch, FromExtensionMessage } from "./git.types";
import { RepoSection } from "../../components/Git/GitSection";
import styled from "styled-components";
import { SecondaryButton } from "../../components/Primitive/Button";
import HorizontalCentered from "../../components/Primitive/HorizontalCentered";
import { useTranslation } from "react-i18next";
import { openFileSystemPicker } from "../../services/commands";

function GitPanelContainer() {
  const client = useRecoilValue(clientState);
  const [branchs, setBranchs] = useState<Record<string, string>>({});
  const folders = useRecoilValue(foldersState);
  const setOpenedFolders = useSetRecoilState(foldersState);
  const { t } = useTranslation();

  useEffect(() => {
    folders.forEach((folder) => {
      // Ignore non-local folders
      if (folder.filesystem !== "local") return;

      client.emitMessage<NotifyExtension>({
        NotifyExtension: {
          msg_type: "ExtensionMessage",
          state_id: client.config.state_id,
          extension_id: "git-for-graviton",
          content: JSON.stringify({
            LoadBranch: {
              path: folder.path,
            },
          }),
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
              setBranchs((branchs) => ({
                ...branchs,
                [content.path]: content.name,
              }));
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
    for (const path of Object.keys(branchs)) {
      let folderExists = false;
      for (const folder of folders) {
        if (folder.path === path) {
          folderExists = true;
        }
      }

      if (!folderExists) {
        delete branchs[path];
        setBranchs({ ...branchs });
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
          Object.keys(branchs).map((path) => {
            return (
              <RepoSection key={path} path={path} branch={branchs[path]} />
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
