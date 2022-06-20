import { ReactElement } from "react";

/**
 * SidePanel API
 */
export class SidePanel {
  public name: string;
  public icon: () => ReactElement<any>;

  /**
   * @param name - The name of the panel
   */
  constructor(name: string) {
    this.name = name;
    this.icon = () => <div />;
  }

  container() {
    return <div />;
  }

  public focus() {
    /**/
  }
}
