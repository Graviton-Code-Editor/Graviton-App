import styled from "styled-components";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Tab } from "../../modules/tab";
import ExtensionsRoute from "./routes/extensions";
import PageSideBar, { SideBarButton } from "../../components/PageSideBar";
import AboutRoute from "./routes/about";
import HorizontalView from "../../components/HorizontalView";
import RouteView from "../../components/RouteView";
import { useEffect } from "react";

const SettingsTabContainerStyled = styled.div`
  padding: 10px;
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
          <Link to="/about">
            <SideBarButton>About</SideBarButton>
          </Link>
        </PageSideBar>
        <RouteView>
          <Routes>
            <Route path="/extensions" element={<ExtensionsRoute />} />
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
      <BrowserRouter>
        <SettingsTabContainer />
      </BrowserRouter>
    );
  }
}

export default SettingsTab;
