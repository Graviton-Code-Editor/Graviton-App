import PromptWindow from "../components/Prompt/Prompt";
import { Option } from "../components/Prompt/Prompt.types";
import { Prompt } from "../modules/prompt";
import { openFileSystemPicker } from "../services/commands";
import WelcomeTab from "../tabs/welcome";
import SettingsTab from "../tabs/settings";
import useTabs from "../hooks/useTabs";
import { useSetRecoilState } from "recoil";
import { foldersState } from "../state/state";
import useTextEditorTab from "../hooks/useTextEditorTab";

function GlobalPromptContainer() {
  const { openTab } = useTabs();
  const setOpenedFolders = useSetRecoilState(foldersState);
  const { pushTextEditorTab } = useTextEditorTab();

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
  ];

  return <PromptWindow options={options} />;
}

/**
 * A built-in prompt that displays commands
 */
export default class GlobalPrompt extends Prompt {
  public promptName = "Global Prompt";
  public container = GlobalPromptContainer;
  public commandID = "global.prompt";
}
