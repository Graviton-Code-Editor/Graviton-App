import { useRecoilState, useRecoilValue } from "recoil";
import FilesystemExplorer from "../components/explorer";
import { Panel } from "../modules/panel";
import TextEditorTab from "../tabs/text_editor";
import { clientState, openedTabsState } from "../utils/atoms";

function ExplorerPanelContainer() {

  const client = useRecoilValue(clientState);
  const [tabs, setTabs] = useRecoilState(openedTabsState);

  async function openFile(path: string) {
    try {
      const fileContent = await client.read_file_by_path(path, "local", 1);

      if (fileContent.Ok) {
        const newTab = new TextEditorTab(path, fileContent.Ok);

        setTabs([...tabs, newTab])
      } else {
        // handle error
      }
    } catch (err) {
       // handle error
    }
  }

  return (
    <div>
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
    this.container = () => <ExplorerPanelContainer />;
  }
}

export default ExplorerPanel;