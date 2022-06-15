import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useCommands from "../../hooks/useCommands";
import useSidePanels from "../../hooks/useSidePanels";
import useViews from "../../hooks/useViews";
import { Prompt } from "../../modules/prompt";
import GlobalPrompt from "../../prompts/global";
import {
  openedViewsAndTabs,
  promptsState,
  showedWindowsState,
} from "../../utils/state";
import { focusedTabState } from "../../utils/state/tab";

export default function Commands() {
  const { registerCommandAction, registerCommands, commands } = useCommands();

  // Register commands
  useEffect(() => {
    registerCommands([
      ["focus.side.panel", {
        name: "Focus selected side panel",
        hotkey: "Ctrl+E",
      }],
      ["close.window", {
        name: "Close Window",
        hotkey: "Esc",
      }],
      ["global.prompt", {
        name: "Global Prompt",
        hotkey: "Ctrl+P",
      }],
      ["split.horizontally", {
        name: "Split Horizontally",
        hotkey: "Ctrl+L",
      }],
      ["close.focused.view", {
        name: "Close Focused View",
        hotkey: "Ctrl+K",
      }],
      ["split.vertically", {
        name: "Split vertically",
        hotkey: "Ctrl+.",
      }],
      ["close.focused.view.panel", {
        name: "Close Focused View Panel",
        hotkey: "Ctrl+,",
      }],
      ["save.focused.tab", {
        name: "Save Focused tab",
        hotkey: "Ctrl+s",
      }],
    ]);
  }, []);

  // Focus the opened side panel

  const { focusSelectedSidePanel } = useSidePanels();

  useEffect(() => {
    registerCommandAction("focus.side.panel", () => {
      focusSelectedSidePanel();
    });
  }, [commands]);

  // Close current displayed window

  const setShowedWindows = useSetRecoilState(showedWindowsState);

  useEffect(() => {
    registerCommandAction("close.window", () => {
      setShowedWindows((val) => {
        const newValue = [...val];
        newValue.pop();
        return newValue;
      });
    });
  }, [commands]);

  // Open Global Prompt

  const prompts = useRecoilValue(promptsState);

  useEffect(() => {
    registerCommandAction("global.prompt", () => {
      setShowedWindows((windows) => {
        let prompExists = false;

        for (const win of windows) {
          if (Prompt.isPrompt(win)) {
            const winPrompt = win as Prompt;
            if (winPrompt.promptName === "Global Prompt") {
              prompExists = true;
            }
          }
        }

        if (prompExists) {
          return windows;
        } else {
          return [...windows, new GlobalPrompt()];
        }
      });
    });
  }, [prompts, commands]);

  // Views hotkeys

  const viewsAndTabs = useRecoilValue(openedViewsAndTabs);
  const {
    newViewInFocused,
    closeFocusedViewPanel,
    newViewPanelInFocused,
    closeFocusedView,
  } = useViews();

  useEffect(() => {
    registerCommandAction("split.horizontally", () => {
      newViewInFocused();
    });
    registerCommandAction("close.focused.view", () => {
      closeFocusedView();
    });
    registerCommandAction("split.vertically", () => {
      newViewPanelInFocused();
    });
    registerCommandAction("close.focused.view.panel", () => {
      closeFocusedViewPanel();
    });
  }, [viewsAndTabs, commands]);

  // Save current focused tab

  const currentFocusedTab = useRecoilValue(focusedTabState);

  useEffect(() => {
    registerCommandAction("save.focused.tab", () => {
      currentFocusedTab.tab?.save({ force: true });
    });
  }, [currentFocusedTab, commands]);

  return null;
}
