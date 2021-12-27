import styled from "styled-components";

const SideBar = styled.div`
  padding: 10px;
  display: grid;
  height: 100%;
  width: 100px;
  grid-template-columns: auto;
  & > a > button {
    width: 100%;
    padding: 8px 12px;
    margin: 2px;
    text-align: left;
    cursor: pointer;
  }
`;

export default SideBar;
