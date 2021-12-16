import { setRecoil, useRecoil } from "../components/external_state";
import PromptContainer, { Option } from "../components/prompt";
import { Prompt } from "../modules/prompt";
import { openedFolders, openedTabsState } from "../utils/atoms";
import { openFolderPicker } from "../utils/commands";
import WelcomeTab from "../tabs/welcome";

function GlobalPromptContainer() {
  const options: Option[] = [
    {
      label: "Open Welcome",
      onSelected({ closePrompt }) {
        closePrompt();
        const tabs = useRecoil(openedTabsState);
        tabs[0][0].push(new WelcomeTab());
        setRecoil(openedTabsState, [...tabs]);
      },
    },
    {
      label: "Open Folder",
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
console.log;
export default class GlobalPrompt extends Prompt {
  public static promptName = "Global Prompt";
  public static container = GlobalPromptContainer;
  public static shortcut = "ctrl+p";
}
