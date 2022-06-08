import { useRecoilState } from "recoil";
import { contextMenuOpened } from "../../utils/state";
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
