import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { CommandConfig, commandsState, loadedCommandsState } from "state";

export interface HotKeyConfig {
  isCtrl: boolean;
  keyCode: string;
}

export function useCommands() {
  const [commands, setCommands] = useRecoilState(commandsState);
  const [loadedCommands, setLoadedCommands] = useRecoilState(
    loadedCommandsState,
  );

  function registerCommandAction(
    commandID: string,
    name: string,
    action: () => void,
  ) {
    if (commands[commandID] != null) {
      const { hotkey } = commands[commandID];
      setLoadedCommands((val) => {
        return {
          ...val,
          [commandID]: {
            hotkey,
            name,
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

      for (const commandID of Object.keys(loadedCommands)) {
        const { hotkey, action } = loadedCommands[commandID];
        const hotkeyConfig = getHotkeyConfig(hotkey);
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
    for (const commandID of Object.keys(loadedCommands)) {
      const command = loadedCommands[commandID];
      if (commandID === id) {
        command.action();
      }
    }
  }

  function loadCommandWithAction(
    commandID: string,
    name: string,
    hotkey: string,
    action: () => void,
  ) {
    setLoadedCommands((val) => {
      return {
        ...val,
        [commandID]: {
          hotkey,
          name,
          action,
        },
      };
    });
  }

  return {
    setCommands,
    commands,
    loadedCommands,
    registerCommandAction,
    registerCommands,
    runCommand,
    loadCommandWithAction,
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
