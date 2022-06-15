import { ReactElement } from "react";

/**
 * SidePanel API
 */
export abstract class SidePanel {
  public name: string;
  public container: () => ReactElement;
  public icon: () => ReactElement<any>;

  /**
   * @param name - The name of the panel
   */
  constructor(name: string) {
    this.name = name;
    this.container = () => <div />;
    this.icon = () => <div />;
  }

  public abstract focus(): void;
}
