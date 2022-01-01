import TextEditor from "../components/TextEditor";
import { EditorState } from "@codemirror/state";
import EditorTab from "../modules/editor_tab";
import { FileFormat } from "../utils/client";
import { basicSetup, EditorView } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";

interface SavedState {
  scrollHeight: number;
}

/*
 * Initial state for the CodeMirror instance
 */
function defaultState({ initialValue }: { initialValue: string }): EditorState {
  return EditorState.create({
    extensions: [basicSetup, javascript(), rust()],
    doc: initialValue,
  });
}

/**
 * A tab that displays a CodeMirror editor inside it
 */
class TextEditorTab extends EditorTab {
  // Tab's state
  private state: SavedState = {
    scrollHeight: 0,
  };

  // CodeMirror instance
  private view: EditorView;

  /**
   *
   * @param path - Path of the opened file
   * @param initialContent - Current content of the file
   */
  constructor(path: string, initialContent: string) {
    super(path, initialContent);

    this.view = new EditorView({
      state: defaultState({
        initialValue: initialContent,
      }),
    });

    this.container = () => {
      return (
        <TextEditor
          view={this.view}
          scrollHeight={this.state.scrollHeight}
          saveScroll={(height) => (this.state.scrollHeight = height)}
        />
      );
    };
  }

  public close(): void {
    this.view.destroy();
    return;
  }

  /*
   * Only open text files
   */
  static isCompatible(format: FileFormat) {
    return format !== "Binary";
  }
  save() {
    return;
  }
}

export default TextEditorTab;
