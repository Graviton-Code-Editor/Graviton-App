import { ReactElement } from "react";
import { FloatingWindow } from "./windows";

/*
 * Prompt API
 */
export class Prompt extends FloatingWindow {
  public promptName = "Prompt";
  public container: () => ReactElement = () => <div />;
  public shortcut: string | undefined;
}
