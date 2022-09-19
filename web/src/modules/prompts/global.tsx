import { PromptWindow } from "features/prompt/components/Prompt";
import { Option, OptionUtils } from "features/prompt/components/Prompt.types";
import { Prompt } from "features/prompt/prompt";
import { openFileSystemPicker } from "services/commands";
import { SettingsTab, WelcomeTab } from "modules/tabs";
import { useSetRecoilState } from "recoil";
import { foldersState } from "state";
import { TerminalTab } from "modules/tabs";
import { Notification } from "features";
import {
  useCommands,
  useNotifications,
  useTabs,
  useTextEditorTab,
} from "hooks";

function GlobalPromptContainer() {
  const { openTab } = useTabs();
  const setOpenedFolders = useSetRecoilState(foldersState);
  const { pushTextEditorTab } = useTextEditorTab();
  const { pushNotification } = useNotifications();
  const { loadedCommands, runCommand } = useCommands();

  const options: Option[] = [
    {
      label: { text: "prompts.Global.OpenWelcome" },
      onSelected({ closePrompt }) {
        closePrompt();
        openTab(new WelcomeTab());
      },
    },
    {
      label: { text: "prompts.Global.OpenSettings" },
      onSelected({ closePrompt }) {
        closePrompt();
        openTab(new SettingsTab());
      },
    },
    {
      label: { text: "prompts.Global.OpenFile" },
      async onSelected({ closePrompt }) {
        closePrompt();
        const openedFile = await openFileSystemPicker("local", "file");
        // If a file selected
        if (openedFile != null) {
          // Clear all opened folders and open the selected one
          pushTextEditorTab(openedFile, "local");
        }
      },
    },
    {
      label: { text: "prompts.Global.OpenFolder" },
      async onSelected({ closePrompt }) {
        closePrompt();
        const openedFolder = await openFileSystemPicker("local", "folder");
        // If a folder selected
        if (openedFolder != null) {
          // Clear all opened folders and open the selected one
          setOpenedFolders([
            {
              path: openedFolder,
              filesystem: "local",
            },
          ]);
        }
      },
    },
    {
      label: { text: "prompts.Global.AddFolder" },
      async onSelected({ closePrompt }) {
        closePrompt();
        const openedFolder = await openFileSystemPicker("local", "folder");
        // If a folder selected
        if (openedFolder != null) {
          // Clear all opened folders and open the selected one
          setOpenedFolders((folders) => [
            {
              path: openedFolder,
              filesystem: "local",
            },
            ...folders,
          ]);
        }
      },
    },
    {
      label: { text: "prompts.Global.OpenTerminal" },
      async onSelected({ closePrompt }) {
        closePrompt();
        openTab(new TerminalTab());
        pushNotification(
          new Notification({
            text: "notifications.TerminalShellUnstable.title",
          }, { text: "notifications.TerminalShellUnstable.content" }),
        );
      },
    },
    ...Object.keys(loadedCommands).map((cmdId) => {
      const cmd = loadedCommands[cmdId];
      return {
        label: {
          text: cmd.name,
        },
        async onSelected({ closePrompt }: OptionUtils) {
          closePrompt();
          runCommand(cmdId);
        },
      };
    }),
  ];

  return <PromptWindow options={options} />;
}

/**
 * A built-in prompt that displays commands
 */
export class GlobalPrompt extends Prompt {
  public promptName = "Global Prompt";
  public container = GlobalPromptContainer;
  public commandID = "global.prompt";
}
