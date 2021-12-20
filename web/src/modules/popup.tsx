import { ReactElement } from "react";
import PopupContainer from "../components/PopupContainer";
import { FloatingWindow } from "./windows";

/**
 * Popup is a dialog-like floating window message
 */
export class Popup extends FloatingWindow {
  public container: () => ReactElement;

  /**
   *
   * @param title - Title of the popup
   * @param content - Body of the popup
   */
  constructor(title: string, content: string) {
    super();
    this.container = () => {
      return <PopupContainer title={title} content={content} />;
    };
  }
}
