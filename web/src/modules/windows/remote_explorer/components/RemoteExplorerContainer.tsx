import { PrimaryButton } from "components/Primitive/Button";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { showedWindowsState } from "state";
import FilesystemExplorer, {
  TreeItem,
  TreeItemInfo,
} from "modules/side_panels/explorer/components/FilesystemExplorer";

const StyledExplorer = styled.div`
  position: fixed;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.elements.prompt.container.border};
  margin-top: 10px;
  width: 350px;
  margin-left: calc(50% - 175px);
  border-radius: 10px;
  height: 430px;
  background: ${({ theme }) => theme.elements.prompt.container.background};
  color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
  & .topView {
    height: calc(100% - 30px);
  }
  & .bottomView {
    display: flex;
    justify-content: end;
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
  const refContainer = useRef<HTMLDivElement | null>(null);
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
    if (
      event.target !== refContainer.current &&
      !refContainer.current?.contains(event.target) && event.target.isConnected
    ) {
      closePopup();
    }
  }

  useEffect(() => {
    setTimeout(() => {
      window.addEventListener("click", closePopupOnClick);
    }, 1);
    return () => window.removeEventListener("click", closePopupOnClick);
  }, []);

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
    <StyledExplorer ref={refContainer}>
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
    </StyledExplorer>
  );
}
