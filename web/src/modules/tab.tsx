import { ReactElement } from "react";

export interface TabData {
  title: string;
}

/**
 * Tab API
 */
export class Tab implements TabData {
  public id: string;
  public title: string;
  public edited: boolean;
  public container: ({
    setEdited,
  }: {
    setEdited: (state: boolean) => void;
  }) => ReactElement;

  /**
   *
   * @param title - Title of the tab
   */
  constructor(title: string) {
    this.id = Date.now().toString();
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
  public save(): void {
    return;
  }

  /**
   *
   * @param data - Construct a new Tab from some data
   * @returns A new Tab
   *
   * @alpha
   */
  public static fromJson(data: TabData): Tab {
    const tab = new Tab(data.title);

    return tab;
  }
}
