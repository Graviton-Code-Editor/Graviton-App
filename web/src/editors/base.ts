import { EditorInterface } from "../types/types";

/*
 * Base editor clas
 * All other editors extend this class
 */
class BaseEditor implements EditorInterface {

    // Name of the editor
    public name: string;

    constructor(){
        this.name = "Base Editor"
    }

    public save(): void {
        return;
    }
}

export default BaseEditor;