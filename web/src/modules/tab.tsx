import { ReactElement } from "react";

export interface TabData {
  title: string;
}

/*
 * Tab API
 */
export class Tab implements TabData {
  public id: string;
  public title: string;
  public container: () => ReactElement;

  constructor(title: string) {
    this.id = Date.now().toString();
    this.title = title;
    this.container = () => <div />;
  }

  public static fromJson(data: TabData): Tab {
    const tab = new Tab(data.title);

    return tab;
  }
}
