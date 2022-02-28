import { ReactElement } from "react";
import RemoteExplorerContainer, {
  RemoteExplorerOptions,
} from "../components/RemoteExplorerContainer";
import { FloatingWindow } from "./windows";

/**
 * Remote explorer, mainly used when Graviton is not running on Tauri
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
