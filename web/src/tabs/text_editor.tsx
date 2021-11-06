import { Tab } from "../modules/tab";

interface CodeMirrorContainerOptions {
    initialContent: string
}

function CodemirrorContainer({ initialContent }: CodeMirrorContainerOptions){
    return (
        <textarea defaultValue={initialContent}/>
    )
}

class TextEditorTab extends Tab {
    constructor(path: string, initialContent: string){
        super(path);
        this.container = () => <CodemirrorContainer initialContent={initialContent}/>
    }
}

export default TextEditorTab;