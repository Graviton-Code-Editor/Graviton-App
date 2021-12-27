import { ReactElement } from "react";
import RemoteExplorerContainer, {
  RemoteExplorerOptions,
} from "../components/RemoteExplorerContainer";
import { FloatingWindow } from "./windows";

/**
 * Remote explorer
 */
export class RemoteExplorer extends FloatingWindow {
  public container: () => ReactElement;

  constructor({ onSelectedFolder }: RemoteExplorerOptions) {
    super();
    this.container = () => {
      return <RemoteExplorerContainer onSelectedFolder={onSelectedFolder} />;
    };
  }
}
