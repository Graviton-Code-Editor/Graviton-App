import { EditorInterface } from "../types";
import BaseEditor from "./base";

/*
 * Text editor that uses CodeMirror v6 under the hood
 */
class TextEditor extends BaseEditor implements EditorInterface {

    public name: String;

    constructor(){
        super();
        this.name = "Text Editor"
    }

    public save(): void {
       
    }
}

export default TextEditor;