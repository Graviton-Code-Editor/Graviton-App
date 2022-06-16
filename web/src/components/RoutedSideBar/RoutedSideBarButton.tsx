import { PrimaryButton } from "../Primitive/Button";
import styled from "styled-components";

export const SideBarButton = styled(PrimaryButton)`
  background: ${({ theme }) => theme.elements.routedSideBar.button.background};
  width: 100%;
  padding: 10px 12px;
  margin: 2px;
  text-align: left;
  cursor: pointer;
  border: 1px solid transparent;
  &:hover {
    background: ${({ theme }) =>
  theme.elements.routedSideBar.button.hover.background};
  border: 1px solid ${({ theme }) =>
  theme.elements.routedSideBar.button.hover.border};
  }
  &:focus {
    outline: 0;
    border: 1px solid ${({ theme }) =>
  theme.elements.routedSideBar.button.focus.border};
  }
`;
