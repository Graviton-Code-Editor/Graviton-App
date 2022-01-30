import TextEditor from "../components/TextEditor";
import { EditorState } from "@codemirror/state";
import EditorTab from "../modules/editor_tab";
import { basicSetup, EditorView } from "@codemirror/basic-setup";
import { keymap, KeyBinding, Command } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";
import { clientState } from "../utils/atoms";
import { getRecoil } from "recoil-nexus";
import { Tab } from "../modules/tab";
import { FileFormat } from "../types/client";

interface SavedState {
  scrollHeight: number;
}

/*
 * Create a KeyMap extension
 */
function getKeymap(tab: Tab) {
  // Save command
  const save: Command = () => {
    tab.save();
    return false;
  };

  const conf: readonly KeyBinding[] = [{ key: "ctrl-s", run: save }];

  return keymap.of(conf);
}

/*
 * Initial state for the CodeMirror instance
 */
function createDefaulState({
  initialValue,
  tab,
}: {
  initialValue: string;
  tab: Tab;
}): EditorState {
  return EditorState.create({
    extensions: [basicSetup, javascript(), rust(), getKeymap(tab)],
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

  // Update the tab component
  public setEditedComp: (state: boolean) => void;

  /**
   *
   * @param path - Path of the opened file
   * @param initialContent - Current content of the file
   */
  constructor(filename: string, path: string, initialContent: string) {
    super(filename, path, initialContent);

    this.setEditedComp = () => {
      console.error("Tried changing an unmounted tab");
    };

    this.view = new EditorView({
      state: createDefaulState({
        initialValue: initialContent,
        tab: this,
      }),
      dispatch: (tx) => {
        if (tx.docChanged) setEdited(true);
        this.view.update([tx]);
      },
    });

    const saveScroll = (height: number) => {
      this.state.scrollHeight = height;
    };

    const setEdited = (state: boolean) => {
      if (this.edited != state) {
        this.setEdited(state);
      }
      this.edited = state;
    };

    this.container = ({ setEdited }) => {
      this.setEditedComp = setEdited;
      return (
        <TextEditor
          view={this.view}
          scrollHeight={this.state.scrollHeight}
          saveScroll={saveScroll}
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

  /*
   * Shortcut to update the tab's state
   */
  public setEdited(state: boolean) {
    if (this.edited != state) {
      this.setEditedComp(state);
    }
    this.edited = state;
  }

  public getContent(): string {
    return this.view.state.doc.sliceString(0);
  }

  public async save() {
    if (this.edited) {
      const client = getRecoil(clientState);
      const newContent = this.getContent();
      await client.write_file_by_path(this.path, newContent, "local");
      this.setEdited(false);
    }
    return;
  }
}

export default TextEditorTab;
