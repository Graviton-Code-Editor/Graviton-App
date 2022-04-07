import { PropsWithChildren, useEffect } from "react";
import { createClient } from "../utils/client";
import {
  openedTabsState,
  clientState,
  prompts,
  panels,
  showedWindows,
  showedStatusBarItem,
  focusedTab,
  tabDataToTabRecursively,
} from "../utils/atoms";
import {
  RecoilRoot,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import RecoilNexus from "recoil-nexus";
import Panels from "./PanelsView";
import Tabs from "./TabsView";
import Theme from "../utils/theme_provider";
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
} from "../types/messages";
import StatusBarView from "./StatusBarView";
import { StatusBarItem } from "../modules/statusbar_item";
import { Tab } from "../modules/tab";
import useEditor from "../hooks/useEditor";
import GlobalPrompt from "../prompts/global";
import useHotkeys from "../hooks/useHotkey";
import TitleBar from "./TitleBar";

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
 * Handles the state Connection
 */
function StateRoot() {
  const setClient = useSetRecoilState(clientState);
  const setPanels = useSetRecoilState(panels);
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
 * Handles the root view
 */
function ClientRoot({
  children,
  isWindows,
}: PropsWithChildren<{ isWindows: boolean }>) {
  const client = useRecoilValue(clientState);
  const usePrompts = useRecoilValue(prompts);
  const [useShowedWindows, setShowedWindows] = useRecoilState(showedWindows);
  const setShowedStatusBarItems = useSetRecoilState(showedStatusBarItem);
  const setTabs = useSetRecoilState(openedTabsState);
  const currentFocusedTab = useRecoilValue(focusedTab);
  const getEditor = useEditor();
  const { pushHotkey } = useHotkeys();

  useEffect(() => {
    /**
     *  Register all prompts's shortcuts
     */
    usePrompts.forEach((PromptClass) => {
      const prompt = new PromptClass();
      if (prompt.shortcut) {
        pushHotkey(prompt.shortcut, () => {
          setShowedWindows((val) => [...val, prompt]);
        });
      }
    });
  }, [usePrompts]);

  /**
   * Show a statusbar button if not shown, and update it in case it's already shown
   */
  const showStatusBarItem = useRecoilCallback(
    ({ set }) =>
      async (statusBarItem: ShowStatusBarItem) => {
        setShowedStatusBarItems((statusBarItems) => {
          const itemIfFound = statusBarItems[statusBarItem.statusbar_item_id];
          if(itemIfFound != null ){
            set(itemIfFound.state, statusBarItem);
            return statusBarItems;
          }else {
            return {
              ...statusBarItems,
              [statusBarItem.statusbar_item_id]: new StatusBarItem(statusBarItem),
            }
          }
        });
      },
    []
  );

  useEffect(() => {
    if (client != null) {
      client.listenToState();

      /**
       * Update the App state if a new state is received
       */
      client.on("StateUpdated", ({ state_data }: StateUpdated) => {
        // Convert all tab datas into Tab instances
        const openedTabs = tabDataToTabRecursively(
          state_data.opened_tabs,
          getEditor
        ) as Tab[];

        // Open the tabs
        if (openedTabs.length > 0) {
          setTabs([[openedTabs]]);
        }
      });

      /**
       * Display Popups
       */
      client.on("ShowPopup", (e: ShowPopup) => {
        setShowedWindows((val) => [
          ...val,
          new Popup({ text: e.title }, { text: e.content }),
        ]);
      });

      /**
       * Display StatusBarItems
       */
      client.on("ShowStatusBarItem", showStatusBarItem);

      /**
       * Hide StatusBarItems
       */
      client.on("HideStatusBarItem", (e: HideStatusBarItem) => {
        setShowedStatusBarItems((currVal) => {
          const filteredStatusBarItems = {...currVal};
          delete filteredStatusBarItems[e.statusbar_item_id];
          return filteredStatusBarItems;
        });
      });
    }

    /**
     * Close all the last opened window when ESC is pressed
     */
    pushHotkey("esc", () => {
      setShowedWindows((val) => {
        const newValue = [...val];
        newValue.pop();
        return newValue;
      });
    });
  }, [client]);

  useEffect(() => {
    /*
     * Save the current focused tab
     */
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
      <StateRoot />
      <RecoilNexus />
      <Theme>
        <ClientRoot isWindows={isWindows}>
          {isWindows && <TitleBar />}
          <div>
            <SplitPane split="vertical" minSize={250} defaultSizes={[2, 10]}>
              <Panels />
              <Tabs />
            </SplitPane>
          </div>
          <StatusBarView />
        </ClientRoot>
      </Theme>
    </RecoilRoot>
  );
}

export default App;
