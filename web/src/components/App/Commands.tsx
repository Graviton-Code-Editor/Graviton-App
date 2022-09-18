import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useCommands, useSidePanels, useTabs, useViews } from "hooks";
import { Prompt } from "features/prompt/prompt";
import { GlobalPrompt, TabsPrompt } from "prompts";
import { openedViewsAndTabs, promptsState, showedWindowsState } from "state";

export default function Commands() {
  const { registerCommandAction, registerCommands, commands } = useCommands();

  // Default Commands
  useEffect(() => {
    registerCommands([
      ["focus.side.panel", {
        hotkey: "Ctrl+E",
      }],
      ["close.window", {
        hotkey: "Esc",
      }],
      ["global.prompt", {
        hotkey: "Ctrl+P",
      }],
      ["split.horizontally", {
        hotkey: "Ctrl+L",
      }],
      ["close.focused.view", {
        hotkey: "Ctrl+K",
      }],
      ["split.vertically", {
        hotkey: "Ctrl+.",
      }],
      ["close.focused.view.panel", {
        hotkey: "Ctrl+,",
      }],
      ["save.focused.tab", {
        hotkey: "Ctrl+S",
      }],
      ["close.focused.tab", {
        hotkey: "Ctrl+W",
      }],
      ["iterate.tabs", {
        hotkey: "Ctrl+Tab",
      }],
    ]);
  }, []);

  // Focus the opened side panel

  const { focusSelectedSidePanel } = useSidePanels();

  useEffect(() => {
    registerCommandAction(
      "focus.side.panel",
      "Focus selected side panel",
      () => {
        focusSelectedSidePanel();
      },
    );
  }, [commands]);

  // Close current displayed window

  const setShowedWindows = useSetRecoilState(showedWindowsState);

  useEffect(() => {
    registerCommandAction("close.window", "Close Window", () => {
      setShowedWindows((val) => {
        const newValue = [...val];
        newValue.pop();
        return newValue;
      });
    });
  }, [commands]);

  // Prompts

  const prompts = useRecoilValue(promptsState);

  useEffect(() => {
    registerCommandAction("global.prompt", "Global Prompt", () => {
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
    registerCommandAction("iterate.tabs", "Iterate over tabs", () => {
      setShowedWindows((windows) => {
        let prompExists = false;

        for (const win of windows) {
          if (Prompt.isPrompt(win)) {
            const winPrompt = win as Prompt;
            if (winPrompt.promptName === "Tabs Prompt") {
              prompExists = true;
            }
          }
        }

        if (prompExists) {
          return windows;
        } else {
          return [...windows, new TabsPrompt()];
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
    focusedView,
  } = useViews();

  useEffect(() => {
    registerCommandAction("split.horizontally", "Split Horizontally", () => {
      newViewInFocused();
    });
    registerCommandAction("close.focused.view", "Close Focused View", () => {
      closeFocusedView();
    });
    registerCommandAction("split.vertically", "Split vertically", () => {
      newViewPanelInFocused();
    });
    registerCommandAction(
      "close.focused.view.panel",
      "Close Focused View Panel",
      () => {
        closeFocusedViewPanel();
      },
    );
  }, [viewsAndTabs, commands, focusedView]);

  // Save current focused tab

  const { focusedTab, closeFocusedTab, saveFocusedTab } = useTabs();

  useEffect(() => {
    registerCommandAction("save.focused.tab", "Save Focused tab", () => {
      saveFocusedTab();
    });
  }, [focusedTab, commands]);

  // Close current focused tab

  useEffect(() => {
    registerCommandAction("close.focused.tab", "Close Focused tab", () => {
      closeFocusedTab();
    });
  }, [focusedTab, focusedView, viewsAndTabs, commands]);

  return null;
}
