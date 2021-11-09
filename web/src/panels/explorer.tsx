import { useRecoilState, useRecoilValue } from "recoil";
import FilesystemExplorer, { TreeItemInfo } from "../components/explorer";
import { Panel } from "../modules/panel";
import TextEditorTab from "../tabs/text_editor";
import { clientState, openedTabsState } from "../utils/atoms";
import FolderOutlined from '../icons/folder_outlined.svg?component'

function ExplorerPanelContainer() {

  const client = useRecoilValue(clientState);
  const [tabs, setTabs] = useRecoilState(openedTabsState);

  async function openFile(item: TreeItemInfo) {
    try {
      const fileContent = await client.read_file_by_path(item.path, "local");

      if (fileContent.Ok) {
        const newTab = new TextEditorTab(item.path, fileContent.Ok);

        setTabs([...tabs, newTab])
      } else {
        // handle error
      }
    } catch (err) {
      // handle error
    }
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <FilesystemExplorer initialRoute="/" onSelected={openFile} />
    </div>
  )
}

/*
 * Built-in panel that displays a files explorer
 */
class ExplorerPanel extends Panel {
  constructor() {
    super("Explorer");
    this.icon = () => <FolderOutlined/>;
    this.container = () => <ExplorerPanelContainer />;
  }
}

export default ExplorerPanel;