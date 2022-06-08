import { PropsWithChildren, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import useEditor from "../../hooks/useEditor";
import useHotkeys from "../../hooks/useHotkey";
import useViews from "../../hooks/useViews";
import { Popup } from "../../modules/popup";
import { StatusBarItem } from "../../modules/statusbar_item";
import { Tab } from "../../modules/tab";
import { HideStatusBarItem, ShowPopup, ShowStatusBarItem, StateUpdated } from "../../types/messaging";
import { clientState, prompts, showedStatusBarItem, showedWindowsState } from "../../utils/state";
import { focusedTabState, tabsState, TabsViews, transformTabsDataToTabs } from "../../utils/state/tabs";
import { focusedViewPanelState } from "../../utils/state/views";

const RootViewContainer = styled.div<{ isWindows: boolean }>`
  background: ${({ theme }) => theme.elements.view.background};
  min-height: 100%;
  max-height: 100%;
  & .Pane > div {
    height: 100%;
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  & > div > .SplitPane {
    height: calc(
      100% - 25px ${({ isWindows }) => isWindows && `- 30px`}
    ) !important;
  }
  & > * {
    flex: 1 !important;
  }
`;

export function RootView({
  children,
  isWindows,
}: PropsWithChildren<{ isWindows: boolean }>) {
  const client = useRecoilValue(clientState);
  const usePrompts = useRecoilValue(prompts);
  const setShowedWindows = useSetRecoilState(showedWindowsState);
  const setShowedStatusBarItems = useSetRecoilState(showedStatusBarItem);
  const [tabs, setTabs] = useRecoilState(tabsState);
  const currentFocusedTab = useRecoilValue(focusedTabState);
  const getEditor = useEditor();
  const { pushHotkey } = useHotkeys();
  const {
    newViewInFocused: newView,
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

  return (
    <RootViewContainer isWindows={isWindows}>
      {client && children}
    </RootViewContainer>
  );
}
