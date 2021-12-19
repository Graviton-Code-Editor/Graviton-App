import { EditorInterface } from "../types/types";
import BaseEditor from "./base";

/**
 * Text editor
 *
 * @alpha
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
