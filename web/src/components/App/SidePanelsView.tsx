import styled from "styled-components";
import { useSidePanels } from "hooks";
import IconButton from "../SideBar/SideBarButton";

const PanelsContainer = styled.div`
  display: flex;
  min-height: 100%;
  background: ${(props) => props.theme.tones.dark1};
  & > .sidebar {
    width: 60px;
    background: ${(props) => props.theme.tones.dark1};
    & svg {
      --sidebarButtonFill: ${({ theme }) => theme.elements.sidebar.button.fill};
    }
  }
  & > .sidepanel {
    border-left: 1px solid
    ${({ theme }) => theme.elements.sidebar.border.color};
    border-top: 1px solid
      ${({ theme }) => theme.elements.sidepanel.border.color};
    border-bottom: 1px solid
      ${({ theme }) => theme.elements.sidepanel.border.color};
    background: ${(props) => props.theme.tones.dark2};
    width: 100%;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    overflow: auto;
    max-height: 100%;
    max-width: 100%;
  }
`;

/*
 * Sidebar that contains all the loaded side panels
 */
function SidePanelsView() {
  const { sidePanels, selectSidePanel, selectedSidePanelName } =
    useSidePanels();

  return (
    <PanelsContainer>
      <div className="sidebar">
        {sidePanels.map((panel) => {
          const isSelected = panel.name === selectedSidePanelName;
          const PanelIcon = panel.icon;
          return (
            <IconButton
              key={panel.name}
              onClick={() => selectSidePanel(panel.name)}
              selected={isSelected}
            >
              <PanelIcon />
            </IconButton>
          );
        })}
      </div>
      <div className="sidepanel">
        {sidePanels.map((panel) => {
          if (panel.name === selectedSidePanelName) {
            const PanelContainer = panel.container;
            return <PanelContainer key={panel.name} />;
          }
        })}
      </div>
    </PanelsContainer>
  );
}

export default SidePanelsView;
