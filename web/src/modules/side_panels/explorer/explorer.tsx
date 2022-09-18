import { atom, useRecoilState } from "recoil";
import FilesystemExplorer, {
  TreeItem,
  TreeItemInfo,
} from "./components/FilesystemExplorer";
import { SidePanel } from "features";
import { foldersState } from "state";
import { ReactSVG } from "react-svg";
import { useTabs } from "hooks";
import { SecondaryButton } from "components/Primitive/Button";
import { openFileSystemPicker } from "services/commands";
import HorizontalCentered from "components/Primitive/HorizontalCentered";
import { SettingsTab } from "tabs";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useTextEditorTab } from "hooks";

const StyledExplorer = styled.div`
  height: 100%;
  padding-left: 5px;
`;

interface ExplorerPanelOptions {
  onFocus: (callback: () => void) => void;
}

const explorerState = atom<TreeItem>({
  key: "explorerState",
  dangerouslyAllowMutability: true,
  default: {
    name: "/",
    isFile: false,
    items: {},
  },
});

function ExplorerPanelContainer({ onFocus }: ExplorerPanelOptions) {
  const [folders, setOpenedFolders] = useRecoilState(foldersState);
  const { openTab } = useTabs();
  const { t } = useTranslation();
  const refExplorer = useRef<HTMLButtonElement>(null);
  const { pushTextEditorTab } = useTextEditorTab();
  const [tree, setTree] = useRecoilState(explorerState);

  useEffect(() => {
    onFocus(() => {
      refExplorer.current?.focus();
    });
  }, []);

  async function openFile(item: TreeItemInfo) {
    if (item.isFile) {
      pushTextEditorTab(item.path, item.filesystem);
    }
  }

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

  function openSettings() {
    openTab(new SettingsTab());
  }

  return (
    <StyledExplorer>
      {folders.length === 0
        ? (
          <HorizontalCentered>
            <div>
              <SecondaryButton
                expanded={true}
                onClick={openFolder}
                maxWidth={200}
                ref={refExplorer}
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
            tree={tree}
            saveTree={(tree) => setTree(tree)}
          />
        )}
    </StyledExplorer>
  );
}

const ExplorerIcon = styled(ReactSVG)`
  & svg {
    stroke: var(--sidebarButtonFill);
  } 
`;

/**
 * Built-in panel that displays a filesystem explorer
 */
export class ExplorerPanel extends SidePanel {
  private callback = () => {/**/};

  constructor() {
    super("Explorer");
    this.icon = () => <ExplorerIcon src="/icons/folder_outlined.svg" />;
    this.container = () => (
      <ExplorerPanelContainer onFocus={(c) => this.callback = c} />
    );
  }

  public focus() {
    this.callback();
  }
}
