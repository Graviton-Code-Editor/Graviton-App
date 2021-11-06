import { useRecoilValue } from "recoil";
import { openedTabsState } from "../utils/atoms";

/*
 * Container that displays all the opened tabs
 */
function Tabs(){

    const tabs = useRecoilValue(openedTabsState);

    return (
        <div>
            {tabs.map((tab) => {
                const Container = tab.container;
                return <Container key={tab.title}/>;
            })}
        </div>
    )
}

export default Tabs;