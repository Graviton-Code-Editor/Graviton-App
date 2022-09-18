import NotificationContainer from "./components/NotificationContainer";
import { TranslatedText } from "types/types";
import { newId } from "utils/id";

export class Notification {
  public container = NotificationContainer;
  public id = newId();

  /**
   * @param title - Title of the notification
   * @param content - Body of the notification
   */
  constructor(public title: TranslatedText, public content: TranslatedText) {}
}
