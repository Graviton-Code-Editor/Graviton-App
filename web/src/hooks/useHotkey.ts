import { useEffect, useState } from "react";

interface HotKeyConfig {
  isCtrl: boolean;
  keyCode: string;
}

// TODO: MacOS would be Meta+X (e.g Mega+S) instad of Ctrl
function getHotkeyConfig(key: string): HotKeyConfig {
  const keys = key.split("+");
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

export default function useHotkeys() {
  const [hotkeys, setHotkeys] = useState<Record<string, () => void>>({});

  function pushHotkey(combo: string, action: () => void) {
    if (hotkeys[combo] != null) {
      setHotkeys((val) => {
        delete val[combo];
        return { ...val };
      });
    }

    setHotkeys((val) => ({ ...val, [combo]: action }));
  }

  useEffect(() => {
    function listener(e: globalThis.KeyboardEvent) {
      for (const combo of Object.keys(hotkeys)) {
        const config = getHotkeyConfig(combo);
        const action = hotkeys[combo];

        if (e.key === config.keyCode && e.ctrlKey === config.isCtrl) {
          action();
        }
      }
      e.stopPropagation();
    }

    window.addEventListener("keyup", listener);

    return () => {
      window.removeEventListener("keyup", listener);
    };
  }, [hotkeys]);

  return {
    pushHotkey,
  };
}
