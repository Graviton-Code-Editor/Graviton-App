import styled from "styled-components";

const ExplorerItem = styled.div<{
  isFile: boolean;
  isOpened: boolean;
}>`
    max-width: 300px;
    display: flex;
    align-items: center;
    cursor: pointer;
    outline: 0;
    white-space: nowrap;
    position: relative;
    background: ${({ theme }) => theme.elements.explorer.item.background};
    color: ${({ theme }) => theme.elements.explorer.item.text.color};
    font-size: 12px;
    border-radius: 5px;
    line-break: none;
    text-overflow: elliptic;
    overflow: hidden;
    border: none;
    min-width: 170px;
    max-width: 200px;
    text-align: left;
    user-select: none;
    &:hover {
      background: ${({ theme }) =>
  theme.elements.explorer.item.hover.background};
    }
    & .arrow svg {
      margin-right: 7px;
      margin-left: 15px;
      margin-top: 2px;
      width: 8px;
      transform: ${({ isOpened }) =>
  isOpened ? " rotate(0deg)" : " rotate(-90deg)"};
      & > rect {
        fill: ${({ theme }) => theme.elements.explorer.item.arrow.fill};
        stroke: ${({ theme }) => theme.elements.explorer.item.arrow.fill};
      }
    }
    & .file svg {
      width: 20px;
      margin-right: 4px;
      margin-top: 3px;
      ${({ isFile }) => isFile && "padding-left: 29px;"}
    }
  `;

export default ExplorerItem;
