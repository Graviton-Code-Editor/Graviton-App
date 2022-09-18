import { ReactElement } from "react";
import RemoteExplorerContainer, {
  RemoteExplorerOptions,
} from "./components/RemoteExplorerContainer";
import { FloatingWindow } from "features";

/**
 * Remote explorer, mainly used when Graviton is not running on Tauri
 */
export class RemoteExplorer extends FloatingWindow {
  public container: () => ReactElement;

  constructor({ onSelectedItem, kind }: RemoteExplorerOptions) {
    super();
    this.container = () => {
      return (
        <RemoteExplorerContainer onSelectedItem={onSelectedItem} kind={kind} />
      );
    };
  }
}
