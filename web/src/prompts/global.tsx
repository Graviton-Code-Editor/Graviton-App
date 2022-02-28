import { setRecoil } from "recoil-nexus";
import PromptContainer, { Option } from "../components/PromptContainer";
import { Prompt } from "../modules/prompt";
import { openedFolders } from "../utils/atoms";
import { openFolderPicker } from "../utils/commands";
import WelcomeTab from "../tabs/welcome";
import SettingsTab from "../tabs/settings";
import useTabs from "../hooks/useTabs";

function GlobalPromptContainer() {
  // TODO: call useTabs from here

  const options: Option[] = [
    {
      label: { text: "prompts.Global.OpenWelcome" },
      onSelected({ closePrompt }) {
        closePrompt();
        const [openTab] = useTabs();
        openTab(new WelcomeTab());
      },
    },
    {
      label: { text: "prompts.Global.OpenSettings" },
      onSelected({ closePrompt }) {
        closePrompt();
        const [openTab] = useTabs();
        openTab(new SettingsTab());
      },
    },
    {
      label: { text: "prompts.Global.OpenFolder" },
      async onSelected({ closePrompt }) {
        closePrompt();
        const openedFolder = await openFolderPicker("local");
        // If a folder selected
        if (openedFolder != null) {
          // Clear all opened folders and open the selected one
          setRecoil(openedFolders, [
            {
              path: openedFolder,
            },
          ]);
        }
      },
    },
  ];

  return <PromptContainer options={options} />;
}

/**
 * A built-in prompt that displays commands
 */
export default class GlobalPrompt extends Prompt {
  public promptName = "Global Prompt";
  public container = GlobalPromptContainer;
  public shortcut = "ctrl+p";
}
