import { useRecoilValue, useSetRecoilState } from "recoil";
import FilesystemExplorer, {
  TreeItemInfo,
} from "../components/FilesystemExplorer";
import { Panel } from "../modules/panel";
import { clientState, foldersState } from "../utils/state";
import { ReactSVG } from "react-svg";
import useEditor from "../hooks/useEditor";
import useTabs from "../hooks/useTabs";
import { SecondaryButton } from "../components/primitive/button";
import { openFolderPicker } from "../utils/commands";

function ExplorerPanelContainer() {
  const client = useRecoilValue(clientState);
  const { openTab } = useTabs();
  const getEditor = useEditor();
  const setOpenedFolders = useSetRecoilState(foldersState);

  async function openFile(item: TreeItemInfo) {
    if (item.isFile) {
      try {
        // TODO(marc2332): For better UX, a content resolver could be passed to the editor creator instead of waiting to read the file, this will make the tab creation faster in "big" files.
        client.read_file_by_path(item.path, "local").then((fileContent) => {
          if (fileContent.Ok) {
            const { content, format } = fileContent.Ok;
            const editor = getEditor(format);
            // Make sure a compatible editor was found
            if (editor != null) {
              const newTab = new editor(
                item.name,
                item.path,
                Promise.resolve(content),
                format
              );
              openTab(newTab);
            } else {
              // Handle error
            }
          } else {
            // Handle error
          }
        });
      } catch (err) {
        console.log(err);
        // handle error
      }
    }
  }

  async function openFolder() {
    const openedFolder = await openFolderPicker("local");
    // If a folder selected
    if (openedFolder != null) {
      // Clear all opened folders and open the selected one
      setOpenedFolders([
        {
          path: openedFolder,
        },
      ]);
    }
  }

  const folders = useRecoilValue(foldersState);

  return (
    <div style={{ height: "100%", paddingLeft: 5 }}>
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
      {folders.length === 0 && (
        <>
          <SecondaryButton expanded={true} onClick={openFolder}>
            Open folder
          </SecondaryButton>
        </>
      )}
    </div>
  );
}

/**
 * Built-in panel that displays a filesystem explorer
 */
export default class ExplorerPanel extends Panel {
  constructor() {
    super("Explorer");
    this.icon = () => <ReactSVG src="/icons/folder_outlined.svg" />;
    this.container = () => <ExplorerPanelContainer />;
  }
}
