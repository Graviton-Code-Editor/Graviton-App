import { SplitPane } from 'react-multi-split-pane';
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { openedTabsState } from "../utils/atoms";
import TabButton from "./tabs/tab_button";
import TabContainer from "./tabs/tab_container";
import TabsPanel from './tabs/tab_panel';

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
                            {columns.map((tabs, c) => {
                                return <TabsPanel key={`${r}${c}_tabs_panel`} tabs={tabs} row={r} col={c}/>
                            })}
                        </SplitPane>
                    )
                })}
            </SplitPane>
        </TabsContainer>
    )
}

export default Tabs;