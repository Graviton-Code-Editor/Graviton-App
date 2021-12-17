import { ReactElement } from "react";
import PopupContainer from "../components/popup";
import { FloatingWindow } from "./windows";

/*
 * Popup API
 */
export class Popup extends FloatingWindow {
  public container: () => ReactElement;

  constructor(title: string, content: string) {
    super();
    this.container = () => {
      return <PopupContainer title={title} content={content} />;
    };
  }
}
