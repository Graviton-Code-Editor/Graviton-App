import styled from "styled-components";

export const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.elements.primaryButton.background};
  color: ${({ theme }) => theme.elements.primaryButton.color};
  padding: 7px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  user-select: none;
`;

export const SecondaryButton = styled.button<{ expanded?: boolean }>`
  background: ${({ theme }) => theme.elements.secondaryButton.background};
  color: ${({ theme }) => theme.elements.secondaryButton.color};
  padding: 9px 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-top: 5px;
  transition: 0.1s;
  user-select: none;
  ${({ expanded }) => expanded && "width: 100%;"}
  &:hover:not(:active) {
    background: ${({ theme }) =>
  theme.elements.secondaryButton.hover.background};
  }
  &:active {
    background: ${({ theme }) =>
  theme.elements.secondaryButton.hover.background};
    transform: scale(0.98);
  }
`;

export const WindowButton = styled.button<{ expanded: boolean }>`
  background: ${({ theme }) => theme.elements.windowButton.background};
  color: ${({ theme }) => theme.elements.windowButton.color};
  padding: 7px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-top: 5px;
  transition: 0.1s;
  user-select: none;
  ${({ expanded }) => expanded && "width: 100%;"}
  &:hover:not(:active) {
    background: ${({ theme }) => theme.elements.windowButton.hover.background};
  }
  &:active {
    background: ${({ theme }) => theme.elements.windowButton.hover.background};
    transform: scale(0.98);
  }
`;
