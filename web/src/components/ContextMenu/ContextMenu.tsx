import { PropsWithChildren, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from "styled-components";
import { TranslatedText } from "types";

export interface MenuHandler {
  label: TranslatedText;
  /**
   * In case of returning "true" the context menu will not be closed
   */
  action: () => boolean;
}

export interface ContextMenuConfig {
  menus: MenuHandler[];
  x: number;
  y: number;
}

interface ContextMenuHooks {
  close: () => void;
}

const openingAnimation = keyframes`
  from {
    transform: scale(0.97);
  }
  to {
    transform: scale(1);
  }  
`;

const ContextMenuContainer = styled.div<
  PropsWithChildren<{ x: number; y: number }>
>`
    padding: 6px;
    min-width: 125px;
    max-width: 170px;
    background: ${({ theme }) => theme.elements.contextMenu.background};
    border-radius: 7px;
    position: fixed;
    left: ${({ x }) => x}px;
    top: ${({ y }) => y}px;
    box-shadow: 0px 0px 10px rgba(0,0,0, 0.2);
    animation: ${openingAnimation} ease-in-out 0.05s;
`;

const ContextMenuButton = styled.button`
    border: none;
    border-radius: 4px;
    padding: 6px 9px;
    width: 100%;
    text-align: left;
    background: transparent;
    color: white;
    cursor: pointer;
    &: hover {
        background: ${({ theme }) =>
  theme.elements.contextMenu.menus.hover.background};
    }
`;

function santitizePositions(
  x: number,
  y: number,
  menus: ContextMenuConfig["menus"],
) {
  let posX = x;
  let posY = y;
  const menusHeight = menus.length * 28;

  // Move the dropdown to the left if it would pass the window bounds
  if ((window.innerWidth - 200) < x) {
    posX -= 190;
  }

  // Move the dropdown up if it would pass the window bounds
  if ((window.innerHeight - 10) < (posY + menusHeight)) {
    posY -= menusHeight + 10;
  }

  return {
    posX,
    posY,
  };
}

export default function ContextMenu(
  { menus, close, x, y }: ContextMenuConfig & ContextMenuHooks,
) {
  const { t } = useTranslation();
  const { posX, posY } = santitizePositions(x, y, menus);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function outsideClickListener(ev: Event) {
      if (ref.current && ev.target) {
        if (!ref.current.contains(ev.target as HTMLElement)) {
          close();
        }
      }
    }

    function windowResizeListener() {
      close();
    }

    window.addEventListener("mouseup", outsideClickListener);
    window.addEventListener("resize", windowResizeListener);

    return () => {
      window.removeEventListener("mouseup", outsideClickListener);
      window.removeEventListener("resize", windowResizeListener);
    };
  }, []);

  return (
    <ContextMenuContainer x={posX} y={posY} ref={ref}>
      {menus.map(({ label, action }) => {
        const onClick = () => {
          const res = action();
          if (res === false) {
            close();
          }
        };

        return (
          <ContextMenuButton key={label.text} onClick={onClick}>
            {t(label.text, label.props)}
          </ContextMenuButton>
        );
      })}
    </ContextMenuContainer>
  );
}
