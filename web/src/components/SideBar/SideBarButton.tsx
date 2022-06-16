import styled from "styled-components";

const StyledIconButton = styled.button<{ selected: boolean }>`
  padding: 5px;
  background: ${({ selected, theme }) =>
  selected
    ? theme.elements.sidebar.button.selected.background
    : theme.elements.sidebar.button.background};
  border: 0;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
  height: 50px;
  width: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;
  margin: 0px 3px;
  margin-bottom: 3px;
  cursor: pointer;
  transition: background 0.1s;
  &:hover {
    background: ${({ selected, theme }) =>
  !selected && theme.elements.sidebar.button.hover.background};
    border: 1px solid ${({ theme }) =>
  theme.elements.sidebar.button.hover.border};
  }
  &:focus {
    outline: none;
    border: 1px solid  ${({ theme }) =>
  theme.elements.sidebar.button.focus.border};
  }
  & svg {
    height: 18px;
    stroke: var(--sidebarButtonFill);
  }
`;
export default StyledIconButton;
