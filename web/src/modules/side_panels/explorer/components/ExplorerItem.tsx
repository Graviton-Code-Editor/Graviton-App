import styled, { keyframes } from "styled-components";

const itemFadeIn = keyframes`
  from {
    opacity: 0.5;
    transform: translateX(-10px);
  }
  to {
    transform: translateX(0px);
    opacity: 1;
  }
`;

const arrowFadeIn = keyframes`
  from {
    transform: rotate(-90deg);
   
  }
  to {
    transform: rotate(0deg);
  }
`;

const ExplorerItem = styled.div<{
  isFile: boolean;
  isOpened: boolean;
  recentlyOpened: boolean;
  recentlyOpenedItems: boolean;
}>`
    max-width: 300px;
    display: flex;
    align-items: center;
    cursor: pointer;
    outline: 0;
    position: relative;
    background: ${({ theme }) => theme.elements.explorer.item.background};
    color: ${({ theme }) => theme.elements.explorer.item.text.color};
    font-size: 12px;
    border-radius: 5px;
    border: none;
    min-width: 170px;
    max-width: 200px;
    user-select: none;
    margin: 0px;
    animation: ${({ recentlyOpenedItems }) =>
  recentlyOpenedItems && itemFadeIn} ease-in-out 0.06s;
    &:hover, &:focus {
      background: ${({ theme }) =>
  theme.elements.explorer.item.hover.background};
    }
    & > span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    & .arrow svg {
      margin-right: 7px;
      margin-left: 15px;
      margin-top: 2px;
      width: 8px;
      transform: ${({ isOpened }) =>
  isOpened ? "rotate(0deg)" : "rotate(-90deg)"};
      animation: ${({ recentlyOpened }) =>
  recentlyOpened && arrowFadeIn} ease-in-out 0.06s;
      & > rect {
        fill: ${({ theme }) => theme.elements.explorer.item.arrow.fill};
        stroke: ${({ theme }) => theme.elements.explorer.item.arrow.fill};
      }
    }
    & .file svg {
      width: 20px;
      height: 20px;
      margin-right: 4px;
      margin-top: 3px;
      ${({ isFile }) => isFile && "padding-left: 29px;"}
    }
`;

export default ExplorerItem;
