import styled from "styled-components";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { Tab } from "features";
import ExtensionsRoute from "./routes/extensions";
import PageSideBar, {
  SideBarButton,
} from "components/RoutedSideBar/RoutedSideBar";
import AboutRoute from "./routes/about";
import HorizontalView from "components/Primitive/HorizontalView";
import RouteView from "components/Primitive/RouteView";
import HotkeysRoute from "./routes/hotkeys";

const SettingsTabContainerStyled = styled.div`
  height: 100%;
  max-height: 100%;
  padding-left: 20px;
  padding-top: 20px;
`;

function SettingsTabContainer() {
  return (
    <SettingsTabContainerStyled>
      <HorizontalView>
        <PageSideBar>
          <Link to="/" tabIndex={-1}>
            <SideBarButton>Extensions</SideBarButton>
          </Link>
          <Link to="/hotkeys" tabIndex={-1}>
            <SideBarButton>Hotkeys</SideBarButton>
          </Link>
          <Link to="/about" tabIndex={-1}>
            <SideBarButton>About</SideBarButton>
          </Link>
        </PageSideBar>
        <RouteView>
          <Routes>
            <Route path="/" element={<ExtensionsRoute />} />
            <Route path="/hotkeys" element={<HotkeysRoute />} />
            <Route path="/about" element={<AboutRoute />} />
          </Routes>
        </RouteView>
      </HorizontalView>
    </SettingsTabContainerStyled>
  );
}

/**
 * The Settings tab
 */
export class SettingsTab extends Tab {
  constructor() {
    super("Settings");
  }

  public container() {
    return (
      <MemoryRouter>
        <SettingsTabContainer />
      </MemoryRouter>
    );
  }
}
