import { useRecoilState } from "recoil";
import { contextMenuOpened } from "atoms";
import ContextMenu from "../ContextMenu/ContextMenu";

export default function ContextMenuView() {
  const [contextMenuConfig, setContextMenuConfig] = useRecoilState(
    contextMenuOpened,
  );

  if (contextMenuConfig != null) {
    return (
      <ContextMenu
        {...contextMenuConfig}
        close={() => setContextMenuConfig(null)}
      />
    );
  }

  return <></>;
}
