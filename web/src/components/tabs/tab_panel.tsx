import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components'
import { Tab } from '../../modules/tab';
import { focusedTab } from '../../utils/atoms';
import TabContainer from './tab_container';
import TabButton from './tab_button';

const TabsPanelContainer = styled.div`
    display: flex;
    flex-direction: column;
    & .tabsList {
        display: flex;
        min-height: 45px;
        overflow-x: auto;
        &::-webkit-scrollbar {
            height: 6px !important;
        }
    }
    & .tabsContainer {
        display: flex;
        height: calc(100% - 45px);
        & > div {
            width: 100%;
        }
        & .cm-editor{
            height: 100%;
        }
    }
`

interface TabPanelOptions {
    tabs: Tab[],
    col: number,
    row: number
}

export default function TabsPanel({ tabs, col, row }: TabPanelOptions) {

    const [selectedTab, setSelectedTab] = useState(0);
    const setFocusedTab = useSetRecoilState(focusedTab);

    function selectTab(index: number) {
        // Update the panel state
        setSelectedTab(index)

        // Focus the tab
        setFocusedTab({
            col,
            row
        })
    }

    return (
        <TabsPanelContainer>
            <div className="tabsList" >
                {tabs.map((tab, i) => {
                    const isSelected = i == selectedTab;
                    return <TabButton key={tab.title} title={tab.title} isSelected={isSelected} select={() => selectTab(i)} />;
                })}
            </div>
            <div className="tabsContainer">
                {tabs.map((tab, i) => {
                    const isSelected = i == selectedTab;
                    const Container = tab.container;
                    return isSelected && (
                        <TabContainer key={tab.title}>
                            <Container />
                        </TabContainer>
                    );
                })}
            </div>
        </TabsPanelContainer>
    )
}