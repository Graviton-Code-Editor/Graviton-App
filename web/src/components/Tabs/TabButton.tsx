import React, { MouseEvent, ReactElement } from "react";
import { ReactSVG } from "react-svg";
import { default as styled, keyframes } from "styled-components";
import useContextMenu from "../../hooks/useContextMenu";
import UnSavedIndicator from "./UnSavedIndicator";

const tabOpening = keyframes`
  0% {
    opacity: 0.1;
    min-width: 15px;
    width: 15px;
  }
  100% {
    opacity: 1;
    min-width: 125px;
    width: 125px;
  }
`;

const TabButtonStyle = styled.div`
  color: white;
  background: transparent;
  padding: 5px 10px;
  font-size: 13px;
  display: flex;
  min-width: 125px;
  max-width: 125px;
  align-items: center;
  cursor: pointer;
  user-select: none;
  animation: ${tabOpening} ease-in 0.14s;
  border-bottom: 1px solid transparent;
  &:not(.selected):hover {
    background: ${({ theme }) => theme.elements.tab.button.hover.background};
  }
  &.selected {
    background: ${({ theme }) => theme.elements.tab.button.focused.background};
    border-bottom-color: ${({ theme }) =>
  theme.elements.tab.button.focused.border};
  }
  & > p {
    margin: 3px;
    margin-right: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 70%;
    flex: 1;
    white-space: pre;
    display: block;
    font-size: 12px;
  }
  & > button {
    width: 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    & svg {
      width: 10px;
      height: 10px;
      & > path {
        stroke: ${({ theme }) => theme.elements.tab.button.fill};
      }
    }
    &:hover svg > path {
      stroke: ${({ theme }) => theme.elements.tab.button.hover.fill};
    }
  }
  & .indicator {
    margin-right: 5px;
  }
`;

const TabButtonIcon = styled.div`
  width: 24px;
  height: 24px;
  & svg {
    height: 24px;
    width: 24px;
  }
`;

interface TabButtonOptions {
  title: string;
  hint?: string;
  isSelected: boolean;
  isEdited: boolean;
  select: () => void;
  close: () => void;
  save: () => void;
  icon: ReactElement;
}

export default function TabButton({
  title,
  hint,
  isSelected,
  select,
  close,
  isEdited,
  save,
  icon,
}: TabButtonOptions) {
  const { pushContextMenu } = useContextMenu();

  function closeTab(event: MouseEvent) {
    event.stopPropagation();
    close();
  }

  function saveTab(event: MouseEvent) {
    event.stopPropagation();
    save();
  }

  function contextMenu(ev: React.MouseEvent) {
    pushContextMenu({
      menus: [
        {
          label: {
            text: "Close",
          },
          action: () => {
            if (isEdited) {
              save();
            } else {
              close();
            }
            return false;
          },
        },
      ],
      x: ev.clientX,
      y: ev.clientY,
    });
    ev.stopPropagation();
  }

  return (
    <TabButtonStyle
      className={isSelected ? "selected" : ""}
      onClick={select}
      onContextMenu={contextMenu}
      title={hint}
    >
      <TabButtonIcon>{icon}</TabButtonIcon>
      <p>{title}</p>
      {isEdited
        ? <UnSavedIndicator className="indicator" onClick={saveTab} />
        : (
          <button onClick={closeTab}>
            <ReactSVG src="/icons/close_cross.svg" />
          </button>
        )}
    </TabButtonStyle>
  );
}
