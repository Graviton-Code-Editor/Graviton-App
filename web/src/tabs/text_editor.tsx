import TextEditor from "../components/TextEditor";
import { EditorState } from "@codemirror/state";
import EditorTab from "../modules/editor_tab";

interface CodeMirrorContainerOptions {
  initialContent: string;
  savedState: any;
  saveState: (state: any) => void;
}

function CodemirrorContainer({
  initialContent,
  savedState,
  saveState,
}: CodeMirrorContainerOptions) {
  return (
    <TextEditor
      scrollPos={savedState.scrollHeight}
      state={savedState.codemirrorState}
      onUpdate={(view) => {
        saveState({
          codemirrorState: view.state,
        });
      }}
      onScroll={(scroll) => {
        saveState({
          scrollHeight: scroll,
        });
      }}
      initialValue={initialContent}
    />
  );
}

interface SavedState {
  scrollHeight: number;
  codemirrorState: EditorState | null;
}

/**
 * A tab that displays a CodeMirror editor inside it
 */
class TextEditorTab extends EditorTab {
  private state: SavedState = {
    scrollHeight: 0,
    codemirrorState: null,
  };

  /**
   *
   * @param path - Path of the opened file
   * @param initialContent - Current content of the file
   */
  constructor(path: string, initialContent: string) {
    super(path, initialContent);

    const saveState = (state: SavedState) => {
      this.state = {
        ...this.state,
        ...state,
      };
    };

    this.container = () => {
      return <CodemirrorContainer
      savedState={this.state}
      initialContent={initialContent}
      saveState={saveState}
    />
    }
  }
  static isCompatible(format: string) {
    switch(format) {
      default:
          return true
    }
  }
  save(){
    return;
  }
}

export default TextEditorTab;
