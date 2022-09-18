import { SplitPane } from "react-multi-split-pane";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { openedViewsAndTabs } from "state";
import { ViewPanelView } from "features/tab/components/ViewPanelView";

const TabsContainer = styled.div`
  overflow: hidden;
  background: green;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.elements.tab.container.background};
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
 * Container that displays all the opened views with their viewpanels and tabs
 */
function ViewsView() {
  const tabsPanels = useRecoilValue(openedViewsAndTabs);

  return (
    <TabsContainer>
      <SplitPane
        split="vertical"
        minSize={20}
        className="row"
        defaultSizes={new Array(tabsPanels.length).fill(200)}
      >
        {tabsPanels.map(({ view_panels, id }, r) => {
          return (
            <SplitPane
              split="horizontal"
              minSize={20}
              defaultSizes={new Array(view_panels.length).fill(200)}
              className="colunmn"
              key={id}
            >
              {view_panels.map((viewPanel, c) => {
                return (
                  <ViewPanelView
                    key={viewPanel.id}
                    panel={viewPanel}
                    row={r}
                    col={c}
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

export default ViewsView;
