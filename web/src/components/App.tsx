import { PropsWithChildren, useEffect } from "react";
import { createClient } from "../utils/client";
import {
  openedTabsState,
  clientState,
  prompts,
  panels,
  showedWindows,
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
import { Popup } from "../modules/popup";
import { ShowPopup, StateUpdated } from "../types/messages";

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

function StateRoot() {
  const setClient = useSetRecoilState(clientState);
  const setTabs = useSetRecoilState(openedTabsState);
  const setPanels = useSetRecoilState(panels);
  const setShowedWindows = useSetRecoilState(showedWindows);

  useEffect(() => {
    getToken().then((token) => {
      if (token !== null) {
        const client = createClient(token);

        // Listen for any change on the state
        client.on("StateUpdated", ({ state }: StateUpdated) => {
          // Convert all tab datas into Tab instances
          const openedTabs = state.opened_tabs.map((tabData: TabData) =>
            Tab.fromJson(tabData)
          );
          // Open the tabs
          if (openedTabs.length > 0) {
            setTabs([[openedTabs]]);
          }
        });

        // Show popups
        client.on("ShowPopup", (e: ShowPopup) => {
          setShowedWindows((val) => [...val, new Popup(e.title, e.content)]);
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
  const [useShowedWindows, setShowedWindows] = useRecoilState(showedWindows);

  // Register all shortcuts
  usePrompts.forEach((prompt) => {
    if (prompt.shortcut) {
      useHotkeys(prompt.shortcut, () => {
        setShowedWindows((val) => [...val, prompt]);
      });
    }
  });

  useHotkeys("esc", () => {
    setShowedWindows((val) => {
      const newValue = [...val];
      newValue.pop();
      return newValue;
    });
  });

  function WindowContainer() {
    if (useShowedWindows.length > 0) {
      const Container = useShowedWindows[useShowedWindows.length - 1].container;
      return <Container />;
    } else {
      return null;
    }
  }

  return (
    <View>
      {client && children}
      <WindowContainer />
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
