import { ReactElement } from "react";
import { FloatingWindow } from "./windows";

/*
 * Prompt API
 */
export abstract class Prompt extends FloatingWindow {
  public static promptName = "Prompt";
  public static container: () => ReactElement = () => <div />;
  public static shortcut: string | undefined;
}
