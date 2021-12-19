import { ReactElement } from "react";
import { FloatingWindow } from "./windows";

/**
 * A Prompt gives tha ability to the user choose between some options
 */
export class Prompt extends FloatingWindow {
  public promptName = "Prompt";
  public container: () => ReactElement = () => <div />;
  public shortcut: string | undefined;
}
