//@ts-ignore
import { Button } from "@gveditor/web_components";
import { useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { showedWindows } from "../utils/atoms";
import FilesystemExplorer, { TreeItemInfo } from "./FilesystemExplorer";
import WindowBackground from "./WindowBackground";

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
    width: 300px;
    border-radius: 10px;
    height: 300px;
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
  onSelectedFolder: (path: string) => void;
}

export default function RemoteExplorerContainer({
  onSelectedFolder,
}: RemoteExplorerOptions) {
  const refBackground = useRef(null);
  const setShowedWindows = useSetRecoilState(showedWindows);
  const [focusedFolder, setFocusedFolder] = useState<TreeItemInfo | null>(null);

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

  function selectedFolder(item: TreeItemInfo) {
    if (!item.isFile) {
      setFocusedFolder(item);
    }
  }

  function openFolder() {
    if (focusedFolder) {
      onSelectedFolder(focusedFolder.path);
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
              initialRoute={"/"}
              onSelected={selectedFolder}
              filesystem_name="local"
            />
          </div>
          <div className="bottomView">
            <Button onClick={openFolder}>
              {focusedFolder ? `Open ${focusedFolder.name}` : "Select a folder"}
            </Button>
          </div>
        </div>
      </StyledExplorer>
    </>
  );
}
