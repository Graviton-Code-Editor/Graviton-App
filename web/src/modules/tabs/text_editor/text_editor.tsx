import { clientState } from "state";
import { getRecoil } from "recoil-nexus";
import { FileFormat } from "services/clients/client.types";
import { Popup } from "features";
import {
  SaveTabOptions,
  Tab,
  TabContextMenuHooks,
  TextEditorTabData,
} from "features/tab/tab";
import FileIcon from "modules/side_panels/explorer/components/FileIcon";
import { FeaturedTextEditor } from "./components/FeaturedTextEditor";
import { EditorView } from "@codemirror/view";

interface SavedState {
  scrollHeight: number;
}

/**
 * A tab that displays a TextEditor inside of it
 */
export class TextEditorTab extends Tab {
  public state: SavedState = {
    scrollHeight: 0,
  };
  public path: string;
  public filename: string;
  public format: FileFormat;
  public lastSavedStateText: string[] = [];
  public view?: EditorView;
  public contentResolver: Promise<string | null>;

  /**
   * @param path - Path of the opened file
   * @param initialContent - Current content of the file
   */
  constructor(
    filename: string,
    path: string,
    contentResolver: Promise<string | null>,
    format: FileFormat,
  ) {
    super(filename);
    this.path = path;
    this.hint = path;
    this.filename = filename;
    this.format = format;
    this.contentResolver = contentResolver;
  }

  public container = FeaturedTextEditor;

  public icon({ tab }: { tab: Tab }) {
    const textEditorTab = tab as unknown as TextEditorTab;
    return (
      <FileIcon
        isOpened={false}
        item={{
          isFile: true,
          name: textEditorTab.filename,
        }}
      />
    );
  }

  contextMenusTab({ tab }: TabContextMenuHooks) {
    const textEditorTab = tab as unknown as TextEditorTab;
    return [
      {
        label: {
          text: "CopyPath",
        },
        action() {
          navigator.clipboard.writeText(textEditorTab.path);
          return false;
        },
      },
    ];
  }

  /**
   * Destroy the CodeMirror view
   */
  public close(): void {
    this.view?.destroy();
    return;
  }

  /**
   * Only open text files
   * @param format - The requested file's format
   */
  static isCompatible(format: FileFormat) {
    return format !== "Binary";
  }

  /**
   * Shortcut to update the tab's state
   * @param state - Wether the editor is edited or not
   */
  public setEdited(state: boolean) {
    this.edited = state;
  }

  /**
   * Get the content of the Codemirror state as a String
   * @returns The current content on the editor
   */
  public getContent(): string | null {
    if (this.view) return this.view.state.doc.sliceString(0);
    return null;
  }

  /**
   * Save the tab
   *
   * @param options - Different options to tweak the saving behavior
   */
  public save({ force, close, setEdited }: SaveTabOptions): Popup | null {
    const safeSave = () => {
      this.saveFile();

      // Mark the tab as saved
      setEdited(false);
    };

    if (force === true) {
      safeSave();
    } else if (this.edited) {
      return new Popup(
        {
          text: "popups.AskSaveFile.title",
          props: { file_path: this.filename },
        },
        {
          text: "popups.AskSaveFile.content",
        },
        [
          {
            label: {
              text: "Save",
            },
            action: () => safeSave(),
          },
          {
            label: {
              text: "Don't save",
            },
            action: () => {
              // User decided to not save the file, therefore close it
              close();
            },
          },
          {
            label: {
              text: "Cancel",
            },
            action: () => undefined,
          },
        ],
        200,
      );
    }
    return null;
  }

  /**
   * Write the file to the FS
   */
  private async saveFile() {
    const currentContent = this.getContent();

    // Make sure the file is loaded and has content
    if (this.view && currentContent != null) {
      const client = getRecoil(clientState);

      // Save the file
      await client.write_file_by_path(this.path, currentContent, "local");

      // Update the last saved state text
      this.lastSavedStateText = this.view.state.doc.toJSON();
    }
  }

  public toJson(): TextEditorTabData {
    return {
      tab_type: "TextEditor",
      path: this.path,
      filesystem: "local",
      format: this.format,
      filename: this.filename,
      id: this.id,
    };
  }
}
