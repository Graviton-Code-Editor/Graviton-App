import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { showedStatusBarItem } from "../utils/atoms";

const StatusBarContainer = styled.div`
  background: red;
  max-height: 25px;
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
      {Object.values(statusBarItems).map((item) => {
        const ItemContainer = item.container;
        return <ItemContainer key={item.id} />;
      })}
    </StatusBarContainer>
  );
}

export default StatusBarView;
