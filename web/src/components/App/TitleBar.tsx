import { WebviewWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import styled from "styled-components";
import { isTauri } from "services/commands";
import LogoIcon from "./LogoIcon";

export const TitleBarContainer = styled.div`
  background: ${({ theme }) => theme.elements.titleBar.background};
  width: 100%;
  max-height: 30px;
  user-select: none;
  display: flex;
  justify-content: flex-end;

  .window-controls {
    width: 140px;
    display: flex;
    & path {
      fill: ${({ theme }) => theme.elements.titleBar.controls.color} !important;
    }

    & button {
      border: 0;
      margin: 0;
      flex: 1;
      min-height: 33px;
      outline: 0;
      left: 0;
      background: ${({ theme }) =>
  theme.elements.titleBar.controls.background} !important;
    }

    & button:hover {
      background: ${({ theme }) =>
  theme.elements.titleBar.controls.hover.background} !important;
    }

    & button:nth-child(3):hover {
      background: ${({ theme }) =>
  theme.elements.titleBar.controls.hover.closeButton
    .background} !important;
    }

    & button:nth-child(3):hover rect.fill {
      fill: ${({ theme }) =>
  theme.elements.titleBar.controls.hover.closeButton.color} !important;
    }
  }
`;

export default function TitleBar() {
  const [appWindow, setAppWindow] = useState<null | WebviewWindow>(null);

  // Dinamically import the tauri API, but only when it's in a tauri window
  useEffect(() => {
    if (isTauri) {
      import("@tauri-apps/api/window").then(({ appWindow }) => {
        setAppWindow(appWindow);
      });
    }
  }, []);

  const minimizeWindow = () => {
    appWindow?.minimize();
  };

  const maximizeWindow = async () => {
    if (await appWindow?.isMaximized()) {
      appWindow?.unmaximize();
    } else {
      appWindow?.maximize();
    }
  };

  const closeWindow = () => {
    appWindow?.close();
  };

  return (
    <TitleBarContainer data-tauri-drag-region>
      <LogoIcon
        src="/icons/icon.png"
        draggable={false}
        data-tauri-drag-region
      />
      {isTauri && (
        <div className="window-controls">
          <button onClick={minimizeWindow}>
            <ReactSVG src="/icons/minimize_window.svg" />
          </button>
          <button onClick={maximizeWindow}>
            <ReactSVG src="/icons/maximize_window.svg" />
          </button>
          <button onClick={closeWindow}>
            <ReactSVG src="/icons/close_window.svg" />
          </button>
        </div>
      )}
    </TitleBarContainer>
  );
}
