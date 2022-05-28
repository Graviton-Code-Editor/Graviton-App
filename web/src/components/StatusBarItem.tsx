import styled from "styled-components";

const StatusBarItemContainer = styled.div`
  display: inline-block;
  color: ${({ theme }) => theme.elements.statusbar.item.color};
  font-size: 12px;
  padding: 0px 10px;
  user-select: none;
  height: 25px;
  user-select: none;
  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
  }
  &:hover {
    background: ${({ theme }) =>
  theme.elements.statusbar.item.hover.background};
  }
`;

export default StatusBarItemContainer;
