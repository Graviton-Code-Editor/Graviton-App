import { StyledPrompt } from "../components/Prompt/Prompt";
import { Prompt } from "../modules/prompt";
import useTabs from "../hooks/useTabs";
import { Option } from "../components/Prompt/Prompt.types";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import WindowBackground from "../components/Window/WindowBackground";
import PromptContainer from "../components/Prompt/PromptContainer";
import PromptOptionsList from "../components/Prompt/PromptOptionsList";
import {
  PromptOption,
  StyledPromptOption,
  StyledPromptOptionIcon,
} from "../components/Prompt/PromptOption";
import { showedWindowsState } from "../state/state";

function TabsPromptContainer() {
  const { viewsAndTabs, focusedView, selectTab } = useTabs();
  const refBackground = useRef(null);
  const setShowedWindows = useSetRecoilState(showedWindowsState);

  const viewPanel = viewsAndTabs[focusedView.row].view_panels[focusedView.col];
  const tabs = [...viewPanel.tabs];
  const selectedTabID = viewPanel.selected_tab_id;

  const [selectedOption, setSelectedOption] = useState<number>(
    tabs.length > 1 ? 1 : 0,
  );

  // Make the selected tab the first one on the list
  const orderedTabs = tabs.sort((a, b) => {
    if (a.id === selectedTabID) {
      return -1;
    } else if (b.id === selectedTabID) {
      return 1;
    } else {
      return 0;
    }
  });

  const options: Option[] = orderedTabs.map((tab) => {
    return {
      label: {
        text: tab.title,
      },
      onSelected({ closePrompt }) {
        selectTab({
          ...focusedView,
          tab,
        });
        closePrompt();
      },
    };
  });

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.ctrlKey === false) {
        options[selectedOption].onSelected({
          closePrompt,
        });
      }
    };

    window.addEventListener("keyup", listener);

    return () => window.removeEventListener("keyup", listener);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        // TODO(marc2332): Implement Ctrl+Shift+Tab shortcut to go up
        case "ArrowUp":
          setSelectedOption((selectedOption) => {
            if (selectedOption > 0) {
              return selectedOption - 1;
            }
            return selectedOption;
          });
          break;
        case "Tab":
        case "ArrowDown":
          setSelectedOption((selectedOption) => {
            if (selectedOption < options.length - 1) {
              return selectedOption + 1;
            }
            return selectedOption;
          });
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);

    if (tabs.length === 0) {
      closePrompt();
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [options]);

  function closePrompt() {
    setShowedWindows((val) => {
      const newValue = [...val];
      newValue.pop();
      return newValue;
    });
  }

  function closePromptOnClick(event: any) {
    if (event.target === refBackground.current) {
      closePrompt();
    }
  }

  return (
    <>
      <WindowBackground />
      <StyledPrompt onClick={closePromptOnClick} ref={refBackground}>
        <PromptContainer>
          <PromptOptionsList>
            {options.map((option, indexOption) => {
              const tab = orderedTabs[indexOption];
              const Icon = orderedTabs[indexOption].icon;
              return (
                <PromptOption
                  key={indexOption}
                  option={option}
                  closePrompt={closePrompt}
                  selectedOption={selectedOption}
                  indexOption={indexOption}
                >
                  <StyledPromptOptionIcon>
                    <Icon tab={tab} />
                  </StyledPromptOptionIcon>

                  {option.label.text}
                </PromptOption>
              );
            })}
            {options.length === 0 && (
              <StyledPromptOption isSelected={true}>
                empty
              </StyledPromptOption>
            )}
          </PromptOptionsList>
        </PromptContainer>
      </StyledPrompt>
    </>
  );
}

/**
 * A built-in prompt that displays tabs
 */
export default class TabsPrompt extends Prompt {
  public promptName = "Tabs Prompt";
  public container = TabsPromptContainer;
  public commandID = "tabs.prompt";
}
