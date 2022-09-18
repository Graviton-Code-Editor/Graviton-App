import React, { MouseEvent, ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { useContextMenu } from "hooks";
import CloseTabIndicator from "./CloseIndicator";
import { UnSavedIndicator } from "./UnSavedIndicator";
import { Transition } from "react-transition-group";
import { Tab } from "features";

const transitionStyles: Record<string, React.CSSProperties> = {
  entering: { opacity: 1, minWidth: 125, width: 125 },
  entered: { opacity: 1, minWidth: 125, width: 125 },
  exiting: { opacity: 1, minWidth: 0, width: 0, padding: "5px 0px" },
  exited: { opacity: 1, minWidth: 0, width: 0, padding: "5px 0px" },
};

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
  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-left: 1px solid transparent;
  transition-property: opacity, min-width, width, padding;
  transition-duration: 0.140s;
  overflow: hidden;
  &:not(.selected):hover {
    background: ${({ theme }) => theme.elements.tab.button.hover.background};
  }
  &.selected {
    background: ${({ theme }) => theme.elements.tab.button.selected.background};
    border-top-color: ${({ theme }) =>
  theme.elements.tab.button.selected.accentBorder};
    border-right: 1px solid ${({ theme }) =>
  theme.elements.tab.button.selected.border};
    &:not(:nth-child(1)){
      border-left: 1px solid ${({ theme }) =>
  theme.elements.tab.button.selected.border};
    }
    
  }
  &.focused {
    border-top-color: ${({ theme }) =>
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
    height: 20px;
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    border-radius: 100%;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    &:focus {
      border: 1px solid ${({ theme }) =>
  theme.elements.tab.button.indicator.focus.border};
    }
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
  tab: Tab;
  isSelected: boolean;
  isEdited: boolean;
  isFocused: boolean;
  select: () => void;
  close: () => void;
  save: () => void;
  icon: ReactElement;
}

export function TabButton({
  tab,
  isSelected,
  isFocused,
  select,
  close,
  isEdited,
  save,
  icon,
}: TabButtonOptions) {
  const { pushContextMenu } = useContextMenu();
  const [mounted, setMounted] = useState(false);

  function closeTab(event: MouseEvent) {
    event.stopPropagation();
    setMounted(false);
    setTimeout(() => {
      close();
    }, 140);
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
        ...tab.contextMenusTab({ close, save, tab }),
      ],
      x: ev.clientX,
      y: ev.clientY,
    });
    ev.stopPropagation();
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Transition in={mounted} timeout={mounted ? 100 : 80}>
      {(state) => (
        <TabButtonStyle
          className={`${isSelected ? "selected" : ""} ${
            isFocused ? "focused" : ""
          }`}
          onClick={select}
          onContextMenu={contextMenu}
          title={tab.hint}
          style={transitionStyles[state]}
        >
          <TabButtonIcon>{icon}</TabButtonIcon>
          <p>{tab.title}</p>
          <button onClick={isEdited ? saveTab : closeTab}>
            {isEdited
              ? <UnSavedIndicator />
              : <CloseTabIndicator src="/icons/close_cross.svg" />}
          </button>
        </TabButtonStyle>
      )}
    </Transition>
  );
}
