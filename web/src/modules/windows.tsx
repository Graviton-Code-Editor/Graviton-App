import { ReactElement } from "react";

/**
 * Floating Window base class
 *
 * @alpha
 */
export class FloatingWindow {
  public container: () => ReactElement = () => <div />;
}
