import styled from "styled-components";

const RootView = styled.div`
  background: ${({ theme }) => theme.elements.view.background};
  min-height: 100%;
  max-height: 100%;
  & .Pane > div {
    height: 100%;
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  & > div > .SplitPane {
    height: calc(100% - 25px) !important;
  }
  & > * {
    flex: 1 !important;
  }
`;

export default RootView;
