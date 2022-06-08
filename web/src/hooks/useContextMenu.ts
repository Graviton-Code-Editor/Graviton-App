import { useSetRecoilState } from "recoil";
import { ContextMenuConfig } from "../components/ContextMenu/ContextMenu";
import { contextMenuOpened } from "../utils/state";

export default function useContextMenu() {
  const setContextMenu = useSetRecoilState(contextMenuOpened);

  return {
    pushContextMenu: (config: ContextMenuConfig) => {
      setContextMenu(config);
    },
  };
}
