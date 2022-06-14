import { atom } from "recoil";

interface LoadedCommand {
  id: string;
  action: () => void;
}

// Actually loaded commands
export const loadedCommandsState = atom<Record<string, LoadedCommand>>({
  key: "loadedCommands",
  default: {},
});

export interface CommandConfig {
  name: string;
  hotkey: string;
}

// Registered commands
export const commandsState = atom<Record<string, CommandConfig>>({
  key: "registeredCommands",
  default: {},
});
