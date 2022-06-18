import React, { MouseEvent, ReactElement, useEffect, useState } from "react";
import { default as styled } from "styled-components";
import useContextMenu from "../../hooks/useContextMenu";
import CloseTabIndicator from "./CloseIndicator";
import UnSavedIndicator from "./UnSavedIndicator";
import { Transition } from "react-transition-group";

const transitionStyles: Record<string, React.CSSProperties> = {
  entering: { opacity: 1, minWidth: 125, width: 125 },
  entered: { opacity: 1, minWidth: 125, width: 125 },
  exiting: { opacity: 0, minWidth: 25, width: 25 },
  exited: { opacity: 0, minWidth: 25, width: 25 },
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
  border-bottom: 1px solid transparent;
  transition: 0.1s;
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
  const [mounted, setMounted] = useState(false);

  function closeTab(event: MouseEvent) {
    event.stopPropagation();
    setMounted(false);
    setTimeout(() => {
      close();
    }, 60);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Transition in={mounted} timeout={mounted ? 100 : 50}>
      {(state) => (
        <TabButtonStyle
          className={isSelected ? "selected" : ""}
          onClick={select}
          onContextMenu={contextMenu}
          title={hint}
          style={transitionStyles[state]}
        >
          <TabButtonIcon>{icon}</TabButtonIcon>
          <p>{title}</p>
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
