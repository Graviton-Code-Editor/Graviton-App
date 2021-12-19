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
  public container: () => ReactElement;

  /**
   *
   * @param title - Title of the tab
   */
  constructor(title: string) {
    this.id = Date.now().toString();
    this.title = title;
    this.container = () => <div />;
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
