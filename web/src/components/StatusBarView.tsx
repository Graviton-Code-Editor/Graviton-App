import styled from "styled-components";

const StatusBarContainer = styled.div`
  background: red;
  max-height: 20px;
  width: 100%;
  background: ${({ theme }) => theme.elements.statusbar.background};
`;

/*
 * StausBar
 */
function StatusBarView() {
  return <StatusBarContainer></StatusBarContainer>;
}

export default StatusBarView;
