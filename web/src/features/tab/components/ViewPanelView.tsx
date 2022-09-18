import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { useCommands, useContextMenu, useTabs, useViews } from "hooks";
import { Tab } from "features";
import { TabButton } from "./TabButton";
import { useTranslation } from "react-i18next";
import { focusedTabState, focusedViewPanelState, ViewPanel } from "state";

const NoTabsOpenedMessageContainer = styled.div`
  color: ${({ theme }) => theme.elements.tab.text.unfocused.color};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  user-select: none;
`;

function NoTabsOpenedMessage() {
  const { t } = useTranslation();
  const { commands } = useCommands();
  return (
    <NoTabsOpenedMessageContainer>
      <span>
        {t("messages.NoTabsOpenedMessage", commands["global.prompt"])}
      </span>
    </NoTabsOpenedMessageContainer>
  );
}

const TabsPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  & .tabsList {
    display: flex;
    min-height: 37px;
    overflow-x: auto;
    background: ${({ theme }) => theme.elements.tab.list.background};
    &:empty {
      background: transparent;
    }
    &::-webkit-scrollbar {
      height: 3px !important;
    }
    &:not(:hover)::-webkit-scrollbar-thumb {
      background: transparent;
    }
  }
  & .tabsContainer {
    display: flex;
    height: calc(100% - 37px);
    & > div {
      width: 100%;
    }
    & .cm-editor {
      height: 100%;
      outline: none;
    }
  }
`;

interface TabPanelOptions {
  panel: ViewPanel<Tab>;
  col: number;
  row: number;
}

export function ViewPanelView({
  panel: { tabs, selected_tab_id },
  col,
  row,
}: TabPanelOptions) {
  const { newView, newViewPanel, closeViewPanelAndView, tabPanels } =
    useViews();
  const { pushContextMenu } = useContextMenu();
  const { focusTab, selectTab, closeTab, saveTab, setTabEdited } = useTabs();
  const setFocusedView = useSetRecoilState(focusedViewPanelState);
  const focused_tab_id = useRecoilValue(focusedTabState).id;

  useEffect(() => {
    // If there isn't any tab opened then set the selected tab to null
    if (tabs.length === 0 && selected_tab_id != null) {
      selectPanelTab(null);
    }

    // Select the first Tab as fallback
    if (tabs.length > 0 && selected_tab_id == null) {
      selectPanelTab(tabs[0]);
    }
  }, [tabs, selected_tab_id]);

  // Focus the tab by the specified ID
  function selectPanelTab(tab: Tab | null) {
    // Update the panel state
    selectTab({ col, row, tab });

    // Focus the tab
    focusTab({
      col,
      row,
      tab,
    });
  }

  // Close the specified tab from this panel
  // It will have a forced close if it's called from the container
  function removeTab(tab: Tab, force: boolean) {
    saveTab({
      tab,
      force,
      col,
      row,
    });
    closeTab({
      col,
      row,
      tab,
    });
  }

  // Save the tab
  function safelySaveTab(tab: Tab) {
    saveTab({ tab, row, col, force: false });
  }

  // Mark this view as focused
  function viewClicked() {
    setFocusedView({
      col,
      row,
    });
  }

  function contextMenuClick(ev: React.MouseEvent) {
    const menus = [];

    // Only show the Close button if there is more than 1 view panel
    if (!(tabPanels.length == 1 && tabPanels[row].view_panels.length === 1)) {
      menus.push({
        label: {
          text: "Close",
        },
        action: () => {
          closeViewPanelAndView({
            col,
            row,
          });
          return false;
        },
      });
    }

    pushContextMenu({
      menus: [
        ...menus,
        {
          label: {
            text: "contextMenus.panels.SplitHorizontally",
          },
          action: () => {
            newView({
              afterRow: row + 1,
            });
            return false;
          },
        },
        {
          label: {
            text: "contextMenus.panels.SplitVertically",
          },
          action: () => {
            newViewPanel({
              row,
            });
            return false;
          },
        },
      ],
      x: ev.pageX,
      y: ev.pageY,
    });
  }

  return (
    <TabsPanelContainer onClick={viewClicked} onContextMenu={contextMenuClick}>
      <div className="tabsList">
        {tabs.map((tab) => {
          const isSelected = tab.id == selected_tab_id;
          const isFocused = tab.id == focused_tab_id;
          const isEdited = tab.edited;
          const { icon: TabIcon } = tab;
          return (
            <TabButton
              key={tab.id}
              icon={<TabIcon tab={tab} />}
              tab={tab}
              isEdited={isEdited}
              isSelected={isSelected}
              isFocused={isFocused}
              select={() => selectPanelTab(tab)}
              close={() =>
                removeTab(tab, false)}
              save={() =>
                safelySaveTab(tab)}
            />
          );
        })}
      </div>
      <div className="tabsContainer">
        {tabs.map((tab) => {
          const isSelected = tab.id == selected_tab_id;
          const Container = tab.container;

          return (
            isSelected && (
              <div
                key={tab.id}
                onClick={() => selectPanelTab(tab)}
              >
                <Container
                  tab={tab}
                  setEdited={(state: boolean) => setTabEdited(tab, state)}
                  close={() => removeTab(tab, true)}
                />
              </div>
            )
          );
        })}
        {tabs.length == 0 ? <NoTabsOpenedMessage /> : <></>}
      </div>
    </TabsPanelContainer>
  );
}
