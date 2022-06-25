import { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  CommandConfig,
  commandsState,
  loadedCommandsState,
} from "../utils/state/commands";

export interface HotKeyConfig {
  isCtrl: boolean;
  keyCode: string;
}

export default function useCommands() {
  const [commands, setCommands] = useRecoilState(commandsState);
  const [loadedCommands, setLoadedCommands] = useRecoilState(
    loadedCommandsState,
  );

  function registerCommandAction(
    commandID: string,
    action: () => void,
  ) {
    if (commands[commandID] != null) {
      const hotkey = commands[commandID].hotkey;
      setLoadedCommands((val) => {
        return {
          ...val,
          [hotkey]: {
            id: commandID,
            action,
          },
        };
      });
    }
  }

  function registerCommands(commandsToRegister: [string, CommandConfig][]) {
    setCommands((commands) => {
      const newCommands: Record<string, CommandConfig> = {};
      commandsToRegister.forEach(([commandID, config]) => {
        newCommands[commandID] = config;
      });

      return { ...commands, ...newCommands };
    });
  }

  useEffect(() => {
    function listener(e: globalThis.KeyboardEvent) {
      if (e.repeat && e.key !== "Escape") return;

      if (e.isComposing) return;

      for (const hotkey of Object.keys(loadedCommands)) {
        const hotkeyConfig = getHotkeyConfig(hotkey);
        const { action } = loadedCommands[hotkey];
        if (
          e.key.toLowerCase() === hotkeyConfig.keyCode.toLowerCase() &&
          e.ctrlKey === hotkeyConfig.isCtrl
        ) {
          action();
        }
      }
      e.stopPropagation();
    }

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [loadedCommands]);

  function runCommand(id: string) {
    for (const command of Object.values(loadedCommands)) {
      if (command.id === id) {
        command.action();
      }
    }
  }

  return {
    setCommands,
    commands,
    registerCommandAction,
    registerCommands,
    runCommand,
  };
}

// TODO: MacOS would be Meta+X (e.g Mega+S) instad of Ctrl
function getHotkeyConfig(key: string): HotKeyConfig {
  const keys = key.toLowerCase().split("+");
  const config = {
    isCtrl: false,
  } as HotKeyConfig;
  for (const key of keys) {
    switch (key) {
      case "ctrl":
        config.isCtrl = true;
        break;
      case "esc":
        config.keyCode = "Escape";
        break;
      default:
        config.keyCode = key;
    }
  }

  return config;
}
