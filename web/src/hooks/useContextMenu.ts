import { useSetRecoilState } from "recoil";
import { ContextMenuConfig } from "../components/ContextMenu/ContextMenu";
import { contextMenuOpened } from "../state/state";

export default function useContextMenu() {
  const setContextMenu = useSetRecoilState(contextMenuOpened);

  return {
    pushContextMenu: (config: ContextMenuConfig) => {
      setContextMenu(config);
    },
  };
}
