import { SplitPane } from "react-multi-split-pane";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { openedTabsState } from "../utils/atoms";
import TabsPanel from "./tabs/tab_panel";

const TabsContainer = styled.div`
  overflow: hidden;
  background: green;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.elements.tabs.container.background};
  min-height: 100%;
  width: 100%;
  & .row {
    display: flex;
    flex-direction: row;
  }
  & .column {
    display: flex;
    flex-direction: column;
  }
`;

/*
 * Container that displays all the opened tabs
 */
function Tabs() {
  const [tabsPanels, setTabsPanels] = useRecoilState(openedTabsState);

  function closeTab(row: number, column: number, index: number) {
    tabsPanels[row][column].splice(index, 1);
    setTabsPanels([...tabsPanels]);
  }

  return (
    <TabsContainer>
      <SplitPane split="horizontal" minSize={20} className="row">
        {tabsPanels.map((columns, r) => {
          return (
            <SplitPane
              split="vertical"
              minSize={20}
              className="colunmn"
              key={`${r}_row`}
            >
              {columns.map((tabs, c) => {
                return (
                  <TabsPanel
                    key={`${r}${c}_tabs_panel`}
                    tabs={tabs}
                    row={r}
                    col={c}
                    close={(i) => closeTab(r, c, i)}
                  />
                );
              })}
            </SplitPane>
          );
        })}
      </SplitPane>
    </TabsContainer>
  );
}

export default Tabs;
