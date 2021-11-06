import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { panels } from "../utils/atoms";
import IconButton from "./panels/icon_button";

const PanelsContainer = styled.div`
    padding: 20px;
    display: flex;
    
`


/*
 * Sidebar that contains all the loaded panels
 */
function Panels() {

    const loadedPanels = useRecoilValue(panels);
    const [displayedPanelName, setDisplayedPanelName] = useState("Explorer");

    return (
        <PanelsContainer>
            <div>
                {loadedPanels.map(({ panel }) => {
                    return <IconButton key={panel.name} onClick={() => setDisplayedPanelName(panel.name)}>{panel.name}</IconButton>
                })}
            </div>
            <div>
                {loadedPanels.map(({ panel }) => {
                    if (panel.name === displayedPanelName) {
                        const PanelContainer = panel.container;
                        return <PanelContainer key={panel.name}/>;
                    }
                })}
            </div>
        </PanelsContainer>
    )
}

export default Panels;