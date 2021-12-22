import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { showedStatusBarItem } from "../utils/atoms";

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
  const statusBarItems = useRecoilValue(showedStatusBarItem);

  return (
    <StatusBarContainer>
      {statusBarItems.map((item) => {
        const ItemContainer = item.container;
        return <ItemContainer />;
      })}
    </StatusBarContainer>
  );
}

export default StatusBarView;
