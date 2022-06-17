import NotificationContainer from "../components/Notification/NotificationContainer";
import { TranslatedText } from "../types/types";

export class Notification {
  public container = NotificationContainer;
  public id = Math.random();

  /**
   * @param title - Title of the notification
   * @param content - Body of the notification
   */
  constructor(public title: TranslatedText, public content: TranslatedText) {}
}
