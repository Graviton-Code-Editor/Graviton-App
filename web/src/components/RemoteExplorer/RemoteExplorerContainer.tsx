import { PrimaryButton } from "../Primitive/Button";
import { useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { showedWindowsState } from "../../state/state";
import FilesystemExplorer, {
  TreeItem,
  TreeItemInfo,
} from "../Filesystem/FilesystemExplorer";
import WindowBackground from "../Window/WindowBackground";

const StyledExplorer = styled.div`
  user-select: none;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  & .explorer {
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.elements.prompt.container.border};
    margin-top: 10px;
    width: 350px;
    border-radius: 10px;
    height: 430px;
    background: ${({ theme }) => theme.elements.prompt.container.background};
    color: white;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
    & > .topView {
      height: calc(100% - 30px);
    }
    & > .bottomView {
      display: flex;
      justify-content: end;
    }
  }
`;

export interface RemoteExplorerOptions {
  kind: "folder" | "file";
  onSelectedItem: (path: string) => void;
}

const folders = [
  { path: "\\", filesystem: "local" },
];

export default function RemoteExplorerContainer({
  kind,
  onSelectedItem,
}: RemoteExplorerOptions) {
  const refBackground = useRef(null);
  const setShowedWindows = useSetRecoilState(showedWindowsState);
  const [focusedItem, setFocusedItem] = useState<TreeItemInfo | null>(null);
  const [tree, setTree] = useState<TreeItem>({
    name: "/",
    isFile: false,
    items: {},
  });

  function closePopup() {
    setShowedWindows((val) => {
      const newValue = [...val];
      newValue.pop();
      return newValue;
    });
  }

  function closePopupOnClick(event: any) {
    if (event.target === refBackground.current) {
      closePopup();
    }
  }

  function selectedItem(item: TreeItemInfo) {
    if (item.isFile && kind === "file") {
      setFocusedItem(item);
    } else if (item.isFile === false && kind === "folder") {
      setFocusedItem(item);
    }
  }

  function openItem() {
    if (focusedItem) {
      onSelectedItem(focusedItem.path);
      closePopup();
    }
  }

  return (
    <>
      <WindowBackground />
      <StyledExplorer onClick={closePopupOnClick} ref={refBackground}>
        <div className="explorer">
          <div className="topView">
            <FilesystemExplorer
              folders={folders}
              tree={tree}
              saveTree={(tree) => setTree(tree)}
              onSelected={selectedItem}
            />
          </div>
          <div className="bottomView">
            <PrimaryButton onClick={openItem}>
              {focusedItem ? `Open ${focusedItem.name}` : `Select a ${kind}`}
            </PrimaryButton>
          </div>
        </div>
      </StyledExplorer>
    </>
  );
}
