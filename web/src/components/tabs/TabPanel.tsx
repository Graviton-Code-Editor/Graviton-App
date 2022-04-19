import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Tab } from "../../modules/tab";
import { focusedTab } from "../../utils/atoms";
import TabButton from "./TabButton";

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
      height: 6px !important;
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
  tabs: Tab[];
  col: number;
  row: number;
  close: (i: number) => void;
}

export default function TabsPanel({ tabs, col, row, close }: TabPanelOptions) {
  // Todo(marc2332): This should be externalized to an atom instead of a local state, so the selected tab can be changed externally
  const [selectedTabID, setSelectedTabID] = useState<string | null>(null);
  const setFocusedTab = useSetRecoilState(focusedTab);

  // Panel's tab states
  const tabsStates: Map<string, boolean> = new Map();
  tabs.forEach((tab) => tabsStates.set(tab.id, tab.edited));
  const [states, setStates] = useState(tabsStates);

  useEffect(() => {
    // If there isn't any tab opened then set the selected tab to null
    if (tabs.length === 0 && selectedTabID != null) {
      selectTab(null);
    }

    // Select the first Tab as fallback
    if (tabs.length > 0 && selectedTabID == null) {
      selectTab(tabs[0]);
    }
  }, [tabs, selectedTabID]);

  /*
   * Focused the tab by the specified ID
   */
  function selectTab(tab: Tab | null) {
    const tabID = tab ? tab.id : null;

    // Update the panel state
    setSelectedTabID(tabID);

    // Focus the tab
    setFocusedTab({
      col,
      row,
      id: tabID,
      tab,
    });
  }

  /*
   * Close the specified tab in this panel
   */
  function removeTab(tab: Tab, index: number) {
    tab.close();
    if (selectedTabID === tab.id) setSelectedTabID(null);
    close(index);
  }

  /*
   * Save the current tab
   */
  function saveTab(tab: Tab) {
    tab.save();
  }

  return (
    <TabsPanelContainer>
      <div className="tabsList">
        {tabs.map((tab, i) => {
          const isSelected = tab.id == selectedTabID;
          const isEdited = states.get(tab.id) as boolean;
          return (
            <TabButton
              key={tab.id}
              title={tab.title}
              isEdited={isEdited}
              isSelected={isSelected}
              select={() => selectTab(tab)}
              close={() => removeTab(tab, i)}
              save={() => saveTab(tab)}
            />
          );
        })}
      </div>
      <div className="tabsContainer">
        {tabs.map((tab, i) => {
          const isSelected = tab.id == selectedTabID;
          const Container = tab.container;

          const setEdited = (state: boolean) => {
            setStates((states) => {
              states.set(tab.id, state);
              return new Map(states);
            });
          };

          return (
            isSelected && (
              <div key={tab.id}>
                <Container
                  setEdited={setEdited}
                  close={() => removeTab(tab, i)}
                />
              </div>
            )
          );
        })}
      </div>
    </TabsPanelContainer>
  );
}
