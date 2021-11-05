import { EditorInterface } from "../types";

/*
 * Base editor clas
 * All other editors extend this class
 */
class BaseEditor implements EditorInterface {

    // Name of the editor
    public name: String;

    constructor(){
        this.name = "Base Editor"
    }

    public save(): void {
        
    }
}

export default BaseEditor;