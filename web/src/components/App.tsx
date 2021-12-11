import { PropsWithChildren, useEffect } from "react";
import { createClient } from "../utils/client";
import Configuration from "../utils/config";
import {
  openedTabsState,
  clientState,
  prompts,
  prompt,
  panels,
} from "../utils/atoms";
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import RecoilExternalState from "./external_state";
import { Tab, TabData } from "../modules/tab";
import Panels from "./panels";
import Tabs from "./tabs";
import Theme from "../utils/theme_provider";
import View from "./view";
import { SplitPane } from "react-multi-split-pane";
import { useHotkeys } from "react-hotkeys-hook";
import { isTauri } from "../utils/commands";
import ExplorerPanel from "../panels/explorer";

/*
 * Retrieve the authentication token
 */
async function getToken() {
  if (isTauri) {
    return "graviton_token"
  } else {
    // Or query the URL to get the token
    return new URL(location.toString()).searchParams.get("token");
  }
}

function StateRoot() {
  const setClient = useSetRecoilState(clientState);
  const setTabs = useSetRecoilState(openedTabsState);
  const setPanels = useSetRecoilState(panels);

  useEffect(() => {
    getToken().then((token) => {
      if (token !== null) {
        const config = new Configuration(
          "http://127.0.0.1:50001",
          `ws://127.0.0.1:7700/listen?token=${token}&state=1`,
          1,
          token
        );
        const client = createClient(config);

        // Listen for any change on the state
        client.on("StateUpdated", function ({ state }) {
          console.log(state)
          // Convert all tab datas into Tab instances
          const openedTabs = state.opened_tabs.map((tabData: TabData) =>
            Tab.fromJson(tabData)
          );
          // Update the atom
          if (openedTabs.length > 0) {
            setTabs(openedTabs);
          }
        });

        // Subscribe for new events on the given state
        client.on("connected", () => {
          client.listenToState();
          setClient(client);
          setPanels([
            {
              panel: new ExplorerPanel(),
            },
          ]);
        });
      }
    });
  }, []);

  return null;
}

function ClientRoot({ children }: PropsWithChildren<any>) {
  const client = useRecoilValue(clientState);

  const usePrompts = useRecoilValue(prompts);
  const [displayedPrompt, setDisplayedPrompt] = useRecoilState(prompt);

  // Register all shortcuts
  usePrompts.forEach((prompt) => {
    if (prompt.shortcut) {
      useHotkeys(prompt.shortcut, () => {
        const promptContainer = prompt.container;
        setDisplayedPrompt(promptContainer);
      });
    }
  });

  useHotkeys("esc", () => {
    setDisplayedPrompt(null);
  });

  return (
    <View>
      {client && children}
      {displayedPrompt}
    </View>
  );
}

function App() {
  return (
    <RecoilRoot>
      <StateRoot />
      <RecoilExternalState />
      <Theme>
        <ClientRoot>
          <SplitPane split="vertical" minSize={250}>
            <Panels />
            <Tabs />
          </SplitPane>
        </ClientRoot>
      </Theme>
    </RecoilRoot>
  );
}

export default App;
