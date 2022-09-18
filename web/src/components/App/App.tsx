import { useEffect } from "react";
import { createClient } from "services/client";
import { clientState, promptsState } from "atoms";
import { RecoilRoot, useSetRecoilState } from "recoil";
import RecoilNexus from "recoil-nexus";
import SidePanelsView from "./SidePanelsView";
import ViewsView from "./ViewsView";
import Theme from "../Providers/ThemeProvider";
import { SplitPane } from "react-multi-split-pane";
import { isTauri } from "services/commands";
import { ExplorerPanel, GitPanel } from "panels";
import StatusBarView from "./StatusBarView";
import { GlobalPrompt } from "prompts";
import TitleBar from "./TitleBar";
import ContextMenuView from "./ContextMenuView";
import WindowsView from "./WindowsView";
import { RootView } from "./RootView";
import Commands from "./Commands";
import { useSidePanels } from "hooks";
import NotificationsView from "./NotificationsView";

/*
 * Retrieve the authentication token
 */
async function getToken() {
  if (isTauri) {
    return "graviton_token";
  } else {
    // Or query the URL to get the token
    return new URL(location.toString()).searchParams.get("token");
  }
}

/**
 * Handles the connection client
 */
function ClientRoot() {
  const setClient = useSetRecoilState(clientState);
  const { pushSidePanel } = useSidePanels();
  const setPrompts = useSetRecoilState(promptsState);

  useEffect(() => {
    // Retrieve the token and then create a new client
    getToken().then(async (token) => {
      if (token !== null) {
        const client = await createClient(token);

        // Wait until it's connected
        client.whenConnected().then(() => {
          setClient(client);
          pushSidePanel(new ExplorerPanel());
          pushSidePanel(new GitPanel());
          setPrompts((val) => [...val, GlobalPrompt]);
        });
      }
    });
  }, []);

  return null;
}

function App() {
  const isWindows = window.navigator.platform === "Win32";

  return (
    <RecoilRoot>
      <ClientRoot />
      <RecoilNexus />
      <Theme>
        <RootView isWindows={isWindows}>
          {isWindows && <TitleBar />}
          <div>
            <SplitPane split="vertical" minSize={250} defaultSizes={[2, 10]}>
              <SidePanelsView />
              <ViewsView />
            </SplitPane>
          </div>
          <WindowsView />
          <ContextMenuView />
          <StatusBarView />
          <NotificationsView />
          <Commands />
        </RootView>
      </Theme>
    </RecoilRoot>
  );
}

export default App;
