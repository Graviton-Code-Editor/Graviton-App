import { useRecoilState, useRecoilValue } from "recoil";
import FilesystemExplorer, {
  TreeItemInfo,
} from "../components/FilesystemExplorer";
import { Panel } from "../modules/panel";
import TextEditorTab from "../tabs/text_editor";
import { clientState, openedFolders, openedTabsState } from "../utils/atoms";
import { ReactSVG } from "react-svg";

function ExplorerPanelContainer() {
  const client = useRecoilValue(clientState);
  const [tabs, setTabs] = useRecoilState(openedTabsState);

  async function openFile(item: TreeItemInfo) {
    try {
      client.read_file_by_path(item.path, "local").then((fileContent) => {
        if (fileContent.Ok) {
          const { content } = fileContent.Ok;
          const newTab = new TextEditorTab(item.path, content);
          tabs[0][0].push(newTab);
          setTabs([...tabs]);
        } else {
          // handle error
        }
      });
    } catch (err) {
      console.log(err);
      // handle error
    }
  }

  const folders = useRecoilValue(openedFolders);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {folders.map(({ path }) => {
        // Note: path shouldn't really be the key and filesystem_name shouldn't be always local
        return (
          <FilesystemExplorer
            initialRoute={path}
            onSelected={openFile}
            key={path}
            filesystem_name="local"
          />
        );
      })}
    </div>
  );
}

/**
 * Built-in panel that displays a filesystem explorer
 */
export default class ExplorerPanel extends Panel {
  constructor() {
    super("Explorer");
    this.icon = () => <ReactSVG src="./src/icons/folder_outlined.svg" />;
    this.container = () => <ExplorerPanelContainer />;
  }
}
