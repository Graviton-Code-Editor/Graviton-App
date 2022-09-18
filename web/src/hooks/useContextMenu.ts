import { useSetRecoilState } from "recoil";
import { ContextMenuConfig } from "../components/ContextMenu/ContextMenu";
import { contextMenuOpened } from "atoms";

export function useContextMenu() {
  const setContextMenu = useSetRecoilState(contextMenuOpened);

  return {
    pushContextMenu: (config: ContextMenuConfig) => {
      setContextMenu(config);
    },
  };
}
