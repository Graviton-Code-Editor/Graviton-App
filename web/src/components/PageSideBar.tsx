import { PrimaryButton } from "./primitive/button";
import styled from "styled-components";

export const SideBarButton = styled(PrimaryButton)`
  background: ${({ theme }) => theme.elements.pageSideBar.button.background};
  width: 100%;
  padding: 8px 12px;
  margin: 2px;
  text-align: left;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) =>
      theme.elements.pageSideBar.button.hover.background};
  }
`;

const PageSideBar = styled.div`
  padding: 10px;
  display: grid;
  height: 100%;
  width: 100px;
  grid-template-columns: auto;
`;

export default PageSideBar;
