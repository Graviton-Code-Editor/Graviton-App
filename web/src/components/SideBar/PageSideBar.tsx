import styled from "styled-components";

const PageSideBar = styled.div`
  padding: 10px;
  display: grid;
  height: 100%;
  min-width: 140px;
  max-width: 140px;
  grid-template-columns: auto;
`;

export default PageSideBar;

export { SideBarButton } from "./PageSideBarButton";
