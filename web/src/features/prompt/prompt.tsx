import { ReactElement } from "react";
import { FloatingWindow } from "../window/windows";

/**
 * A Prompt gives tha ability to the user choose between some options
 */
export class Prompt extends FloatingWindow {
  public promptName = "Prompt";
  public container: () => ReactElement = () => <div />;
  public commandID?: string;

  public static isPrompt(val: FloatingWindow) {
    return !!(val as any)["promptName"];
  }
}
