import TextEditor from "../components/TextEditor/TextEditor";
import { Extension, StateCommand } from "@codemirror/state";
import { basicSetup, EditorState, EditorView } from "@codemirror/basic-setup";
import { Command, KeyBinding, keymap } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { clientState, showedWindows } from "../utils/state";
import { getRecoil, setRecoil } from "recoil-nexus";
import { FileFormat } from "../types/client";
import { Popup } from "../modules/popup";
import * as commands from "@codemirror/commands";
import { SaveTabOptions, Tab, TextEditorTabData } from "../modules/tab";
import { rust } from "@codemirror/lang-rust";
import { basename, dirname } from "path";
import { EventEmitterTransport } from "@open-rpc/client-js";
import { EventEmitter } from "events";
import {
  LanguageServerClient,
  languageServerWithTransport,
} from "codemirror-languageserver";
import { useEffect, useState } from "react";
import TabText from "../components/Tabs/TabText";
import LoadingTabContent from "../components/Tabs/LoadingTabContent";
import {
  LanguageServerInitialization,
  LanguageServerNotification,
  NotifyLanguageServers,
} from "../types/messaging";
import FileIcon from "../components/Filesystem/FileIcon";
import useLSPClients from "../hooks/useLSPClients";

interface SavedState {
  scrollHeight: number;
}

/**
 * A tab that displays a CodeMirror editor inside it
 */
class TextEditorTab extends Tab {
  public state: SavedState = {
    scrollHeight: 0,
  };
  public path: string;
  public filename: string;
  public format: FileFormat;
  public lastSavedStateText: string[] = [];
  public view?: EditorView;

  public setEditedComp: (state: boolean) => void = () => {
    /**/
  };
  public closeTabComp: () => void = () => {
    /**/
  };
  public setViewComp: (view: EditorView) => void = () => {
    /**/
  };

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
    this.filename = filename;
    this.format = format;
    this.contentResolver = contentResolver;
  }

  public container = TabTextEditorContainer;

  public icon({ tab }: { tab: Tab }) {
    const textEditorTab = tab as unknown as TextEditorTab;
    return (
      <FileIcon
        isOpened={false}
        item={{
          isFile: true,
          name: textEditorTab.filename,
          depth: 1,
          path: textEditorTab.path,
          filesystem: "local",
        }}
      />
    );
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
    if (this.edited != state) {
      this.setEditedComp(state);
    }
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
  public save({ force }: SaveTabOptions = { force: false }) {
    // Save the tab forcefully, e.j, from a shortcut
    if (force === true) return void this.saveFile();

    if (this.edited) {
      const message = new Popup(
        {
          text: "popups.AskSaveFile.title",
          props: { file_path: this.filename },
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
        195,
      );

      setRecoil(showedWindows, (val) => [...val, message]);
    }
    return;
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

      // Mark the tab as saved
      this.setEdited(false);

      // Update the last saved state text
      this.lastSavedStateText = this.view.state.doc.toJSON();
    }
  }

  /**
   * Return the custom keymap
   */
  public getKeymap() {
    // Save command
    const save: Command = () => {
      this.saveFile();
      return false;
    };

    // Undo command
    const undo: StateCommand = (target) => {
      commands.undo(target);
      return checkEditStatus(target);
    };

    // Redo command
    const redo: StateCommand = (target) => {
      commands.redo(target);
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

  /**
   * @returns The tab's data
   *
   * @alpha
   */
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

function TabTextEditorContainer({
  setEdited,
  close,
  tab,
}: {
  setEdited: () => void;
  close: () => void;
  tab: Tab;
}) {
  const textEditorTab = tab as unknown as TextEditorTab;

  const [view, setView] = useState(textEditorTab.view);
  const { find, add } = useLSPClients();

  useEffect(() => {
    textEditorTab.setEditedComp = setEdited;
    textEditorTab.closeTabComp = close;
    textEditorTab.setViewComp = setView;

    // Wait until the tab is mounted to read it's content
    textEditorTab.contentResolver.then((initialValue) => {
      if (initialValue) {
        textEditorTab.view = new EditorView({
          state: createDefaulState({
            initialValue,
          }),
          dispatch: (tx) => {
            if (tx.docChanged) textEditorTab.setEdited(true);
            (textEditorTab.view as EditorView).update([tx]);
          },
        });

        // Update the view component
        textEditorTab.setViewComp(textEditorTab.view);
      } else {
        // If there is no content to read then just close the tab
        textEditorTab.close();
        textEditorTab.closeTabComp();
      }
    });

    /**
     * Create the initial state for the CodeMirror instance
     */
    function createDefaulState({
      initialValue,
    }: {
      initialValue: string;
    }): EditorState {
      const extensions = [textEditorTab.getKeymap(), basicSetup];
      let lspLanguage: [string, string] | null = null;

      if (typeof textEditorTab.format !== "string") {
        switch (textEditorTab.format.Text) {
          case "TypeScript":
            lspLanguage = ["typescript", textEditorTab.format.Text];
            extensions.push(javascript());
            break;
          case "JavaScript":
            lspLanguage = ["javascript", textEditorTab.format.Text];
            extensions.push(javascript());
            break;
          case "Rust":
            lspLanguage = ["rust", textEditorTab.format.Text];
            extensions.push(rust());
            break;
          default:
            lspLanguage = null;
        }
      }

      // TODO(marc2332):
      // - This should not assume there is a language server implementation running
      //   Instead, the language server must notify this frontend

      // LSP IS DISABLED FOR NOW
      // @ts-ignore
      if (lspLanguage != null && true === false) {
        const [languageId] = lspLanguage;
        const unixPath = textEditorTab.path.replace(/\\/g, "/");
        const rootUri = `file:///${dirname(unixPath)}`;

        const lsClient = find(rootUri, languageId);

        const lspPlugin = createLSPPlugin(
          languageId,
          unixPath,
          rootUri,
          (client) => {
            add({
              rootUri,
              languageId,
              client,
            });
          },
          lsClient,
        );

        extensions.push(lspPlugin);
      }

      const state = EditorState.create({
        extensions,
        doc: initialValue,
      });

      // Leave the just created state as the latest one saved
      textEditorTab.lastSavedStateText = state.doc.toJSON();

      return state;
    }
  }, []);

  const saveScroll = (height: number) => {
    textEditorTab.state.scrollHeight = height;
  };

  if (view) {
    return (
      <TextEditor
        view={view}
        scrollHeight={textEditorTab.state.scrollHeight}
        saveScroll={saveScroll}
      />
    );
  } else {
    return (
      <LoadingTabContent>
        <TabText>Loading content...</TabText>
      </LoadingTabContent>
    );
  }
}

function createLSPPlugin(
  languageId: string,
  unixPath: string,
  rootUri: string,
  clientCreated: (client: LanguageServerClient) => void,
  lsClient?: LanguageServerClient,
): Extension {
  if (!lsClient) {
    const client = getRecoil(clientState);

    // Emit the initialization of the language server
    client.emitMessage<NotifyLanguageServers<LanguageServerInitialization>>({
      NotifyLanguageServers: {
        state_id: client.config.state_id,
        msg_type: "Initialization",
        id: languageId,
      },
    });

    const eventEmitter = new EventEmitter();

    const eventEmitterTransport = new EventEmitterTransport(
      eventEmitter,
      "/req",
      "/res",
    );

    lsClient = new (LanguageServerClient as any)({
      transport: eventEmitterTransport,
      rootUri,
      languageId,
      workspaceFolders: [
        {
          name: basename(dirname(unixPath)),
          uri: unixPath,
        },
      ],
    });

    let running = false;

    // Forward any request from the language server to the CodeMirror client
    client.on("NotifyLanguageServersClient", (data) => {
      eventEmitter.emit("/res", data.content);
      if (!running) {
        clientCreated(lsClient as LanguageServerClient);
      } else {
        running = !running;
      }
    });

    // Forward any request from the CodeMirror client to the language server
    eventEmitter.addListener("/req", async (data) => {
      const jsonData = JSON.stringify(data);

      await client.emitMessage<
        NotifyLanguageServers<LanguageServerNotification>
      >({
        NotifyLanguageServers: {
          state_id: client.config.state_id,
          msg_type: "Notification",
          id: languageId,
          content: JSON.stringify(jsonData),
        },
      });
    });
  }

  const lspPlugin = (languageServerWithTransport as any)({
    client: lsClient,
    rootUri,
    documentUri: `file:///${unixPath}`,
    languageId,
    workspaceFolders: [
      {
        name: basename(dirname(unixPath)),
        uri: unixPath,
      },
    ],
  });

  return lspPlugin;
}

export default TextEditorTab;
