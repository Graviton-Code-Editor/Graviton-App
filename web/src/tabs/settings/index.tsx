import styled from "styled-components";
import {
  Link,
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Tab } from "../../modules/tab";
import ExtensionsRoute from "./routes/extensions";
import PageSideBar, {
  SideBarButton,
} from "../../components/RoutedSideBar/RoutedSideBar";
import AboutRoute from "./routes/about";
import HorizontalView from "../../components/Primitive/HorizontalView";
import RouteView from "../../components/Primitive/RouteView";
import { useEffect } from "react";
import HotkeysRoute from "./routes/hotkeys";

const SettingsTabContainerStyled = styled.div`
  height: 100%;
  max-height: 100%;
  padding-left: 20px;
  padding-top: 20px;
`;

function SettingsTabContainer() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/extensions");
  }, []);

  return (
    <SettingsTabContainerStyled>
      <HorizontalView>
        <PageSideBar>
          <Link to="/extensions">
            <SideBarButton>Extensions</SideBarButton>
          </Link>
          <Link to="/hotkeys">
            <SideBarButton>Hotkeys</SideBarButton>
          </Link>
          <Link to="/about">
            <SideBarButton>About</SideBarButton>
          </Link>
        </PageSideBar>
        <RouteView>
          <Routes>
            <Route path="/extensions" element={<ExtensionsRoute />} />
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
class SettingsTab extends Tab {
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

export default SettingsTab;
