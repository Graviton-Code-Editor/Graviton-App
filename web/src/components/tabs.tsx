import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { openedTabsState } from "../utils/atoms";

const TabsContainer = styled.div`
    overflow: hidden;
    background: ${({ theme }) => theme.elements.tabsContainer.background};
`

/*
 * Container that displays all the opened tabs
 */
function Tabs(){

    const tabs = useRecoilValue(openedTabsState);

    return (
        <TabsContainer>
            {tabs.map((tab) => {
                const Container = tab.container;
                return <Container key={tab.title}/>;
            })}
        </TabsContainer>
    )
}

export default Tabs;