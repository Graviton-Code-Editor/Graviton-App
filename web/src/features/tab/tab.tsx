import { MenuHandler } from "components/ContextMenu/ContextMenu";
import { FileFormat } from "services/clients/client.types";
import { Popup } from "../popup/popup";

// Serialized data of the TextEditor Tab
export interface TextEditorTabData {
  tab_type: string;
  path: string;
  filesystem: string;
  format: FileFormat;
  filename: string;
  id: string;
}

// Serialized data of any basic Tabs
export interface BasicTabData {
  tab_type: string;
  title: string;
  id: string;
}

export type TabData = BasicTabData | TextEditorTabData;

export interface SaveTabOptions {
  force: boolean;
  close: () => void;
  setEdited: (state: boolean) => void;
}

export interface TabContextMenuHooks {
  tab: Tab;
  close: () => void;
  save: () => void;
}

/**
 * Tab API
 */
export abstract class Tab implements Omit<BasicTabData, "tab_type"> {
  public id: string;
  public title: string;
  public edited: boolean;
  public hint?: string;

  /**
   * @param title - Title of the tab
   */
  constructor(title: string) {
    this.id = Date.now().toString() + Math.random();
    this.title = title;
    this.edited = false;
  }

  /* eslint-disable */
  contextMenusTab(_hooks: TabContextMenuHooks): MenuHandler[] {
    return [];
  }

  /**
   * @param options - Different utils for the container
   */
  /* eslint-disable */
  public container(_: {
    tab: Tab;
    setEdited: (state: boolean) => void;
    close: () => void;
  }) {
    return <div />;
  }

  /* eslint-disable */
  public icon(_: { tab: Tab }) {
    return <></>;
  }

  /**
   * Called when the tab is closed
   */
  public close(): void {
    return undefined;
  }

  /**
   * Called when the tab is being saved
   * @param options - Different options to tweak the saving behavior
   */
  /* eslint-disable */
  public save(_options?: SaveTabOptions): Popup | null {
    return null;
  }

  // Serialize the Tab's data
  public toJson(): TabData {
    return {
      tab_type: "Basic",
      title: this.title,
      id: this.id,
    };
  }
}
