import { PropsWithChildren, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { useCommands, useEditor, useTabs } from "hooks";
import { Popup } from "features";
import { StatusBarItem, Tab } from "features";
import { WelcomeTab } from "tabs";
import {
  HideStatusBarItem,
  RegisterCommand,
  ShowPopup,
  ShowStatusBarItem,
  StateUpdated,
  UnloadedLanguageServer,
} from "types";
import { clientState, showedStatusBarItem, showedWindowsState } from "state";
import { deserializeViews, Views } from "state";
import { useLSPClients } from "hooks";
import { CommandActioned, UIEvent } from "types";

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
  const setShowedWindows = useSetRecoilState(showedWindowsState);
  const setShowedStatusBarItems = useSetRecoilState(showedStatusBarItem);
  const { openTab, openTabs } = useTabs();
  const getEditor = useEditor();
  const { setCommands, loadCommandWithAction } = useCommands();
  const { dispose } = useLSPClients();

  useEffect(() => {
    if (client != null) {
      client.listenToState();

      // Load the received state
      client.on("StateUpdated", ({ state_data }: StateUpdated) => {
        // Convert all Tab datas into Tab instances
        const openedTabs = deserializeViews(
          state_data.views,
          getEditor,
          client,
        ) as Array<Views<Tab>>;

        const allTabs = openedTabs
          .map(({ view_panels }) => view_panels)
          .flat()
          .map((view) => view.tabs)
          .flat();

        // Open the tabs
        if (allTabs.length > 0) {
          openTabs([...openedTabs]);
        } else {
          openTab(new WelcomeTab());
        }

        setCommands((val) => ({ ...val, ...state_data.commands }));
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

      // Register Commands
      client.on("RegisterCommand", (e: RegisterCommand) => {
        loadCommandWithAction(e.id, e.name, "", () => {
          client.emitMessage<UIEvent<CommandActioned>>({
            UIEvent: {
              msg_type: "CommandActioned",
              state_id: client.config.state_id,
              id: e.id,
            },
          });
        });
      });

      // Notify the client that a language server has stopped
      client.on("UnloadedLanguageServer", (e: UnloadedLanguageServer) => {
        dispose(e.id);
      });
    }
  }, [client]);

  return (
    <RootViewContainer isWindows={isWindows}>
      {client && children}
    </RootViewContainer>
  );
}
