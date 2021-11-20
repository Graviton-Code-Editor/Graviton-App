import PromptContainer, { Option } from "../components/prompt";
import { Prompt } from "../modules/prompt";

function GlobalPromptContainer(){

    const options: Option[] = [
        {
            label: "Open Folder",
            onSelected() {
               
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