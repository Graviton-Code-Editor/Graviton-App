import { SplitPane } from 'react-multi-split-pane';
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { openedTabsState } from "../utils/atoms";
import TabButton from "./tabs/tab";
import TabContainer from "./tabs/tab_container";

const TabsContainer = styled.div`
    overflow: hidden;
    background: green;
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.elements.tabsContainer.background};
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
    & .tabsList {
        display: flex;
        padding: 5px;
    }
    & .tabsContainer {
        display: flex;
    }
`

/*
 * Container that displays all the opened tabs
 */
function Tabs() {

    const tabsPanels = useRecoilValue(openedTabsState);

    return (
        <TabsContainer>
            <SplitPane split="horizontal" minSize={20} className="row" >
                {tabsPanels.map((columns, r) => {
                    return (
                        <SplitPane split="vertical" minSize={20} className="colunmn" key={`${r}_row`} >
                            {columns.map((panels, c) => {
                                return <>
                                    <div className="tabsList" key={`${r}${c}_tabs_list`}>
                                        {panels.map((tab) => {
                                            return <TabButton key={tab.title} title={tab.title} />;
                                        })}
                                    </div>,
                                    <div className="tabsContainer" key={`${r}${c}_tabs_container`}>
                                        {panels.map((tab) => {
                                            const Container = tab.container;
                                            return (
                                                <TabContainer key={tab.title}>
                                                    <Container />
                                                </TabContainer>
                                            );
                                        })}
                                    </div>
                                </>
                            })}
                        </SplitPane>
                    )
                })}
            </SplitPane>
        </TabsContainer>
    )
}

export default Tabs;