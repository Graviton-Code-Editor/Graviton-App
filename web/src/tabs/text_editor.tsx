import TextEditor from "../components/TextEditor";
import { EditorState, StateCommand } from "@codemirror/state";
import EditorTab from "../modules/editor_tab";
import { basicSetup, EditorView } from "@codemirror/basic-setup";
import { keymap, KeyBinding, Command } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";
import { clientState, showedWindows } from "../utils/atoms";
import { getRecoil, setRecoil } from "recoil-nexus";
import { FileFormat } from "../types/client";
import { Popup } from "../modules/popup";
import * as history from "@codemirror/history";

interface SavedState {
  scrollHeight: number;
}

/**
 * A tab that displays a CodeMirror editor inside it
 */
class TextEditorTab extends EditorTab {
  // Tab's state
  private state: SavedState = {
    scrollHeight: 0,
  };

  private lastSavedStateText: string[] = [];

  // CodeMirror instance
  private view: EditorView;

  // Update the tab component
  public setEditedComp: (state: boolean) => void;
  // Close the tab component
  public closeTabComp: () => void;

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

    this.closeTabComp = () => {
      console.error("Can't close an unmounted tab");
    };

    this.view = new EditorView({
      state: this.createDefaulState({
        initialValue: initialContent,
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

    this.container = ({ setEdited, close }) => {
      this.setEditedComp = setEdited;
      this.closeTabComp = close;
      return (
        <TextEditor
          view={this.view}
          scrollHeight={this.state.scrollHeight}
          saveScroll={saveScroll}
        />
      );
    };
  }

  /*
   * Create a KeyMap extension
   */
  private getKeymap() {
    // Save command
    const save: Command = () => {
      this.saveFile();
      return false;
    };

    // Undo command
    const undo: StateCommand = (target) => {
      history.undo(target);
      return checkEditStatus(target);
    };

    // Redo command
    const redo: StateCommand = (target) => {
      history.redo(target);
      return checkEditStatus(target);
    };

    // If the new state doc is the same as the last saved one then set the tab as unedited
    const checkEditStatus: StateCommand = (target) => {
      const currentStateText = target.state.doc.toJSON();

      if (
        this.lastSavedStateText.length == currentStateText.length &&
        this.lastSavedStateText.every((e, i) => e == currentStateText[i])
      ) {
        this.setEdited(false);
      } else {
        this.setEdited(true);
      }

      return false;
    };

    // Define the custom keymap
    const customKeymap: readonly KeyBinding[] = [
      { key: "mod-s", run: save },
      { key: "mod-y", run: redo, preventDefault: true },
      { key: "mod-z", run: undo, preventDefault: true },
    ];

    return keymap.of(customKeymap);
  }

  /*
   * Initial state for the CodeMirror instance
   */
  private createDefaulState({
    initialValue,
  }: {
    initialValue: string;
  }): EditorState {
    const state = EditorState.create({
      extensions: [this.getKeymap(), basicSetup, javascript(), rust()],
      doc: initialValue,
    });

    // Leave the just created state as the latest one saved
    this.lastSavedStateText = state.doc.toJSON();

    return state;
  }

  /*
   * Destroy the CodeMirror view
   */
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

  /*
   * Get the content of the codemirror as a String
   */
  public getContent(): string {
    return this.view.state.doc.sliceString(0);
  }

  /*
   * Write the file to the FS
   */
  private async saveFile() {
    const client = getRecoil(clientState);
    const newContent = this.getContent();
    await client.write_file_by_path(this.path, newContent, "local");

    // Mark the tab as saved
    this.setEdited(false);

    // Update the last saved state text
    this.lastSavedStateText = this.view.state.doc.toJSON();
  }

  public save() {
    if (this.edited) {
      const message = new Popup(
        {
          text: "popups.AskSaveFile.title",
          props: { file_path: this.path },
        },
        {
          text: "popups.AskSaveFile.content",
        },
        [
          {
            label: "Save",
            action: this.saveFile.bind(this),
          },
          {
            label: "Don't save",
            action: () => {
              // User decided to not save the file, therefore close it
              this.closeTabComp();
            },
          },
          {
            label: "Cancel",
            action: () => undefined,
          },
        ],
        240
      );

      setRecoil(showedWindows, (val) => [...val, message]);
    }
    return;
  }
}

export default TextEditorTab;
