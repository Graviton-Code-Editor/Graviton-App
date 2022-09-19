import { Prompt } from "features/prompt/prompt";
import { useTabs } from "hooks";
import { Option } from "features/prompt/components/Prompt.types";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import PromptContainer from "features/prompt/components/PromptContainer";
import PromptOptionsList from "features/prompt/components/PromptOptionsList";
import {
  PromptOption,
  StyledPromptOption,
  StyledPromptOptionIcon,
} from "features/prompt/components/PromptOption";
import { showedWindowsState } from "state";

function TabsPromptContainer() {
  const { viewsAndTabs, focusedView, selectTab, focusTab } = useTabs();
  const refContainer = useRef<HTMLDivElement | null>(null);
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
        const tabPos = {
          ...focusedView,
          tab,
        };
        selectTab(tabPos);
        focusTab(tabPos);
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
    if (
      event.target !== refContainer.current &&
      !refContainer.current?.contains(event.target)
    ) {
      closePrompt();
    }
  }

  useEffect(() => {
    window.addEventListener("click", closePromptOnClick);
    return () => window.removeEventListener("click", closePromptOnClick);
  }, []);

  return (
    <PromptContainer ref={refContainer}>
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
  );
}

/**
 * A built-in prompt that displays tabs
 */
export class TabsPrompt extends Prompt {
  public promptName = "Tabs Prompt";
  public container = TabsPromptContainer;
  public commandID = "tabs.prompt";
}
