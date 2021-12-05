import { EditorInterface } from "../types/types";
import BaseEditor from "./base";

/*
 * Text editor that uses CodeMirror v6 under the hood
 */
class TextEditor extends BaseEditor implements EditorInterface {
  public name: string;

  constructor() {
    super();
    this.name = "Text Editor";
  }

  public save(): void {
    return;
  }
}

export default TextEditor;
