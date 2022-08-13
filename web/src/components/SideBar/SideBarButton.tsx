import styled from "styled-components";

const StyledIconButton = styled.button<{ selected: boolean }>`
  padding: 5px;
  background: ${({ selected, theme }) =>
  selected
    ? theme.elements.sidebar.button.selected.background
    : theme.elements.sidebar.button.background};
  border: 0;
  height: 50px;
  width: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;
  margin: 0px 3px;
  margin-top: 3px;
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
  & svg{
    height: 18px;
  }
`;
export default StyledIconButton;
