import styled from "styled-components";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Tab } from "../../modules/tab";
import ExtensionsRoute from "./routes/extensions";
import SideBar from "../../components/SideBar";
//@ts-ignore
import { Button } from "@gveditor/web_components";
import AboutRoute from "./routes/about";
import HorizontalView from "../../components/HorizontalView";
import RouteView from "../../components/RouteView";

const SettingsTabContainerStyled = styled.div`
  padding: 10px;
`;

function SettingsTabContainer() {
  return (
    <SettingsTabContainerStyled>
      <BrowserRouter>
        <HorizontalView>
          <SideBar>
            <Link to="/extensions">
              <Button>Extensions</Button>
            </Link>
            <Link to="/about">
              <Button>About</Button>
            </Link>
          </SideBar>
          <RouteView>
            <Routes>
              <Route path="/extensions" element={<ExtensionsRoute />} />
              <Route path="/about" element={<AboutRoute />} />
            </Routes>
          </RouteView>
        </HorizontalView>
      </BrowserRouter>
    </SettingsTabContainerStyled>
  );
}

/**
 * The Settings tab
 */
class SettingsTab extends Tab {
  constructor() {
    super("Settings");
    this.container = () => <SettingsTabContainer />;
  }
}

export default SettingsTab;
