import { useRecoilValue, useSetRecoilState } from "recoil";
import FilesystemExplorer, {
  TreeItemInfo,
} from "../components/Filesystem/FilesystemExplorer";
import { SidePanel } from "../modules/side_panel";
import { clientState, foldersState } from "../utils/state";
import { ReactSVG } from "react-svg";
import useEditor from "../hooks/useEditor";
import useTabs from "../hooks/useTabs";
import { SecondaryButton } from "../components/Primitive/Button";
import { openFolderPicker } from "../services/commands";
import HorizontalCentered from "../components/Primitive/HorizontalCentered";
import SettingsTab from "../tabs/settings";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import styled from "styled-components";

const StyledExplorer = styled.div`
  height: 100%;
  padding-left: 5px;
  &:focus {
    outline: none;
  }
`;

interface ExplorerPanelOptions {
  onFocus: (callback: () => void) => void;
}

function ExplorerPanelContainer({ onFocus }: ExplorerPanelOptions) {
  const folders = useRecoilValue(foldersState);
  const client = useRecoilValue(clientState);
  const { openTab } = useTabs();
  const getEditor = useEditor();
  const setOpenedFolders = useSetRecoilState(foldersState);
  const { t } = useTranslation();
  const refExplorer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onFocus(() => {
      refExplorer.current?.focus();
    });
  }, []);

  async function openFile(item: TreeItemInfo) {
    if (item.isFile) {
      try {
        client.read_file_by_path(item.path, "local").then((fileContent) => {
          if (fileContent.Ok) {
            const { content, format } = fileContent.Ok;
            const editor = getEditor(format);
            // Make sure a compatible editor was found
            if (editor != null) {
              const newTab = new editor(
                item.name,
                item.path,
                Promise.resolve(content),
                format,
              );
              openTab(newTab);
            } else {
              // Handle error
            }
          } else {
            // Handle error
            console.log(fileContent.Err);
          }
        });
      } catch (err) {
        console.log(err);
        // handle error
      }
    }
  }

  async function openFolder() {
    const openedFolder = await openFolderPicker("local");
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

  function openSettings() {
    openTab(new SettingsTab());
  }

  return (
    <StyledExplorer ref={refExplorer} tabIndex={0}>
      {folders.length === 0
        ? (
          <HorizontalCentered>
            <div>
              <SecondaryButton
                expanded={true}
                onClick={openFolder}
                maxWidth={200}
              >
                {t("prompts.Global.OpenFolder")}
              </SecondaryButton>
              <SecondaryButton
                expanded={true}
                onClick={openSettings}
                maxWidth={200}
              >
                {t("prompts.Global.OpenSettings")}
              </SecondaryButton>
            </div>
          </HorizontalCentered>
        )
        : (
          <FilesystemExplorer
            folders={folders}
            onSelected={openFile}
          />
        )}
    </StyledExplorer>
  );
}

/**
 * Built-in panel that displays a filesystem explorer
 */
export default class ExplorerPanel extends SidePanel {
  private callback = () => {/**/};

  constructor() {
    super("Explorer");
    this.icon = () => <ReactSVG src="/icons/folder_outlined.svg" />;
    this.container = () => (
      <ExplorerPanelContainer onFocus={(c) => this.callback = c} />
    );
  }

  public focus() {
    this.callback();
  }
}
