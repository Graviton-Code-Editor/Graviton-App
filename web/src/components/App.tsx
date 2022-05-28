import { PropsWithChildren, useEffect } from "react";
import { createClient } from "../utils/client";
import {
  clientState,
  panelsState,
  prompts,
  showedStatusBarItem,
  showedWindows,
  tabsState,
} from "../utils/state";
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import RecoilNexus from "recoil-nexus";
import Panels from "./PanelsView";
import Tabs from "./TabsView";
import Theme from "./ThemeProvider";
import View from "./RootView";
import { SplitPane } from "react-multi-split-pane";
import { isTauri } from "../utils/commands";
import ExplorerPanel from "../panels/explorer";
import { Popup } from "../modules/popup";
import {
  HideStatusBarItem,
  ShowPopup,
  ShowStatusBarItem,
  StateUpdated,
} from "../types/messaging";
import StatusBarView from "./StatusBarView";
import { StatusBarItem } from "../modules/statusbar_item";
import { Tab } from "../modules/tab";
import useEditor from "../hooks/useEditor";
import GlobalPrompt from "../prompts/global";
import useHotkeys from "../hooks/useHotkey";
import TitleBar from "./TitleBar";
import {
  focusedTabState,
  TabsViews,
  transformTabsDataToTabs,
} from "../utils/state/tabs";
import useViews from "../hooks/useViews";
import { focusedViewPanelState } from "../utils/state/views";

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
  const setPanels = useSetRecoilState(panelsState);
  const setPrompts = useSetRecoilState(prompts);

  useEffect(() => {
    // Retrieve the token and then create a new client
    getToken().then(async (token) => {
      if (token !== null) {
        const client = await createClient(token);

        // Wait until it's connected
        client.whenConnected().then(() => {
          setClient(client);
          setPanels([
            {
              panel: new ExplorerPanel(),
            },
          ]);
          setPrompts((val) => [...val, GlobalPrompt]);
        });
      }
    });
  }, []);

  return null;
}

/**
 * Manage the different states
 */
function StateRoot({
  children,
  isWindows,
}: PropsWithChildren<{ isWindows: boolean }>) {
  const client = useRecoilValue(clientState);
  const usePrompts = useRecoilValue(prompts);
  const [useShowedWindows, setShowedWindows] = useRecoilState(showedWindows);
  const setShowedStatusBarItems = useSetRecoilState(showedStatusBarItem);
  const [tabs, setTabs] = useRecoilState(tabsState);
  const currentFocusedTab = useRecoilValue(focusedTabState);
  const getEditor = useEditor();
  const { pushHotkey } = useHotkeys();
  const {
    newView,
    closeFocusedView,
    newViewPanelInFocused,
    closeFocusedViewPanel,
  } = useViews();
  const focusedView = useRecoilValue(focusedViewPanelState);

  useEffect(() => {
    // Register all prompts's shortcuts
    usePrompts.forEach((PromptClass) => {
      const prompt = new PromptClass();
      if (prompt.shortcut) {
        pushHotkey(prompt.shortcut, () => {
          setShowedWindows((val) => [...val, prompt]);
        });
      }
    });
  }, [usePrompts]);

  useEffect(() => {
    if (client != null) {
      client.listenToState();

      // Load the received state
      client.on("StateUpdated", ({ state_data }: StateUpdated) => {
        // Convert all tab datas into Tab instances
        const openedTabs = transformTabsDataToTabs(
          state_data.opened_tabs,
          getEditor,
          client,
        ) as Array<TabsViews<Tab>>;

        const allTabs = openedTabs
          .flat()
          .map((view) => view.tabs)
          .flat();

        // Open the tabs
        if (allTabs.length > 0) {
          setTabs([...openedTabs]);
        } else {
          setTabs([[{ tabs: [] }]]);
        }
      });

      // Display Popups when
      client.on("ShowPopup", (e: ShowPopup) => {
        setShowedWindows((val) => [
          ...val,
          new Popup({ text: e.title }, { text: e.content }),
        ]);
      });

      // Show a statusbar button if not shown, and update it if it's already shown
      client.on("ShowStatusBarItem", (statusBarItem: ShowStatusBarItem) => {
        setShowedStatusBarItems((statusBarItems) => {
          const itemIfFound = statusBarItems[statusBarItem.id];
          // Update the statusbar item if found, or create it otherwise
          if (itemIfFound != null) {
            itemIfFound.options = statusBarItem;
            return { ...statusBarItems };
          } else {
            return {
              ...statusBarItems,
              [statusBarItem.id]: new StatusBarItem(statusBarItem),
            };
          }
        });
      });

      // Hide StatusBarItems
      client.on("HideStatusBarItem", (e: HideStatusBarItem) => {
        setShowedStatusBarItems((currVal) => {
          const filteredStatusBarItems = { ...currVal };
          delete filteredStatusBarItems[e.id];
          return filteredStatusBarItems;
        });
      });

      // Close all the last opened window when ESC is pressed
      pushHotkey("esc", () => {
        setShowedWindows((val) => {
          const newValue = [...val];
          newValue.pop();
          return newValue;
        });
      });
    }
  }, [client]);

  useEffect(() => {
    // Create a new view to the right
    pushHotkey("ctrl+l", () => {
      newView();
    });

    // Close the focused view
    pushHotkey("ctrl+k", () => {
      closeFocusedView();
    });

    // Create a new view panel in the focused view
    pushHotkey("ctrl+.", () => {
      newViewPanelInFocused();
    });

    // Close the focused view panel
    pushHotkey("ctrl+,", () => {
      closeFocusedViewPanel();
    });
  }, [tabs, focusedView]);

  useEffect(() => {
    // Save the current focused tab
    pushHotkey("ctrl+s", () => {
      currentFocusedTab.tab?.save({ force: true });
    });
  }, [currentFocusedTab]);

  function WindowsView() {
    if (useShowedWindows.length > 0) {
      const Container = useShowedWindows[useShowedWindows.length - 1].container;
      return <Container />;
    } else {
      return null;
    }
  }

  return (
    <View isWindows={isWindows}>
      {client && children}
      <WindowsView />
    </View>
  );
}

function App() {
  const isWindows = window.navigator.platform === "Win32";

  return (
    <RecoilRoot>
      <ClientRoot />
      <RecoilNexus />
      <Theme>
        <StateRoot isWindows={isWindows}>
          {isWindows && <TitleBar />}
          <div>
            <SplitPane split="vertical" minSize={250} defaultSizes={[2, 10]}>
              <Panels />
              <Tabs />
            </SplitPane>
          </div>
          <StatusBarView />
        </StateRoot>
      </Theme>
    </RecoilRoot>
  );
}

export default App;
