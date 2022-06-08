import { PrimaryButton } from "../Primitive/Button";
import styled from "styled-components";

export const SideBarButton = styled(PrimaryButton)`
  background: ${({ theme }) => theme.elements.pageSideBar.button.background};
  width: 100%;
  padding: 10px 12px;
  margin: 2px;
  text-align: left;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) =>
  theme.elements.pageSideBar.button.hover.background};
  }
`;
