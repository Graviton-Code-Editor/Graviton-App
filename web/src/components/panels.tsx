import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { panels } from "../utils/atoms";
import IconButton from "./panels/icon_button";

const PanelsContainer = styled.div`
    display: flex;    
    & > .sidebar {
        background: ${props => props.theme.tones.dark1};
    }
    & > .sidepanel {
        background: ${props => props.theme.tones.dark2};
        width: 100%;
        padding: 10px;
    }
`

/*
 * Sidebar that contains all the loaded panels
 */
function Panels() {

    const loadedPanels = useRecoilValue(panels);
    const [displayedPanelName, setDisplayedPanelName] = useState("Explorer");

    return (
        <PanelsContainer>
            <div className="sidebar">
                {loadedPanels.map(({ panel }) => {
                    const isSelected = panel.name === displayedPanelName;
                    return <IconButton key={panel.name} onClick={() => setDisplayedPanelName(panel.name)} selected={isSelected}>{panel.name}</IconButton>
                })}
            </div>
            <div className="sidepanel">
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