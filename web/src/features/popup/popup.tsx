import { ReactElement } from "react";
import PopupContainer, {
  PopupButtonOptions,
} from "./components/PopupContainer";
import { TranslatedText } from "types";
import { FloatingWindow } from "../window/windows";

/**
 * Popup is a dialog-like floating window message
 */
export class Popup extends FloatingWindow {
  public container: () => ReactElement;

  /**
   * @param title - Title of the popup
   * @param content - Body of the popup
   * @param buttons - Collection of buttons
   * @param height - Height of the popup, default to 200
   * @param width - Width of the popup, default to 200
   */
  constructor(
    title: TranslatedText,
    content: TranslatedText,
    buttons: PopupButtonOptions[] = [],
    height = 200,
    width = 300,
  ) {
    super();
    this.container = () => {
      return (
        <PopupContainer
          title={title}
          content={content}
          buttons={buttons}
          height={height}
          width={width}
        />
      );
    };
  }
}
