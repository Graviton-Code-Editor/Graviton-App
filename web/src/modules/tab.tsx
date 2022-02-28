import { ReactElement } from "react";

export interface TextEditorTabData {
  tab_type: string;
  path: string;
  filesystem: string;
  content: string;
  filename: string;
}

export interface BasicTabData {
  tab_type: string;
  title: string;
}

export type TabData = BasicTabData | TextEditorTabData;

export interface SaveTabOptions {
  force: boolean;
}

/**
 * Tab API
 */
export class Tab implements Omit<BasicTabData, "tab_type"> {
  public id: string;
  public title: string;
  public edited: boolean;
  public container: ({
    setEdited,
    close,
  }: {
    setEdited: (state: boolean) => void;
    close: () => void;
  }) => ReactElement;

  /**
   *
   * @param title - Title of the tab
   */
  constructor(title: string) {
    this.id = Date.now().toString() + Math.random();
    this.title = title;
    this.edited = false;
    this.container = () => <div />;
  }

  /**
   * Called when the tab is closed
   */
  public close() {
    return;
  }

  /**
   * Called when the tab is being saved
   */
  public save(_options: SaveTabOptions = { force: false }): void {
    return;
  }

  /**
   *
   * @param data - Construct a new Tab from some data
   * @returns A new Tab
   *
   * @alpha
   */
  public static fromJson(data: BasicTabData): Tab | undefined {
    const tab = new Tab(data.title);

    return tab;
  }

  /**
   *
   * @returns The tab's data
   *
   * @alpha
   */
  public toJson(): TabData {
    return {
      tab_type: "Basic",
      title: this.title,
    };
  }
}
