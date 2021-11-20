import { setRecoil } from "recoil-nexus";
import PromptContainer, { Option } from "../components/prompt";
import { Prompt } from "../modules/prompt";
import { openedFolders } from "../utils/atoms";
import { openFolderPicker } from "../utils/commands";

function GlobalPromptContainer(){

    const options: Option[] = [
        {
            label: "Open Folder",
            async onSelected({ closePrompt }) {
                closePrompt();
                const openedFolder = await openFolderPicker();
                // Folder selected
                if(openedFolder != null){
                    setRecoil(openedFolders, [{
                        path: openedFolder
                    }])
                }
                
            }
        }
    ];

    return (
        <PromptContainer options={options}/>
    )
}

export default class GlobalPrompt extends Prompt {
    public static promptName = "Global Prompt";
    public static container = GlobalPromptContainer;
    public static shortcut = "ctrl+p"
}