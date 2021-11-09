import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { openedTabsState } from "../utils/atoms";
import TabButton from "./tabs/tab";
import TabContainer from "./tabs/tab_container";

const TabsContainer = styled.div`
    overflow: hidden;
    background: ${({ theme }) => theme.elements.tabsContainer.background};
    display: flex;
    flex-direction: column;
    & > .tabsList {
        display: flex;
        padding: 5px;
    }
    & > .tabsContainer {
        display: flex;
    }
`

/*
 * Container that displays all the opened tabs
 */
function Tabs() {

    const tabs = useRecoilValue(openedTabsState);

    return (
        <TabsContainer>
            <div className="tabsList">
                {tabs.map((tab) => {
                    return <TabButton key={tab.title} title={tab.title} />;
                })}
            </div>
            <div  className="tabsContainer">
                {tabs.map((tab) => {
                    const Container = tab.container;
                    return (
                        <TabContainer key={tab.title}>
                            <Container />
                        </TabContainer>
                    );
                })}
            </div>
        </TabsContainer>
    )
}

export default Tabs;