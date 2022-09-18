import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
//@ts-ignore
import { FixedSizeList as List } from "react-window";
//@ts-ignore
import AutoSizer from "react-virtualized-auto-sizer";
import { ReactSVG } from "react-svg";
import { DirItemInfo } from "services/clients/client.types";
import FileIcon from "./FileIcon";
import { basename } from "utils/path";
import { FolderState } from "state";
import { clientState } from "atoms";
import ExplorerItem from "./ExplorerItem";
import { useContextMenu } from "hooks";
import { dirname } from "path";

const ExplorerContainer = styled.div`
  padding: 5px;
  height: calc(100% - 10px);
  overflow: hidden;
`;

interface ExplorerOptions {
  // Opened folders
  folders: FolderState[];
  // Callback executed when a item is clicked
  onSelected: (path: TreeItemInfo) => void;

  tree?: TreeItem;

  saveTree?: (tree: TreeItem) => void;
}

interface TreeItems {
  [key: string]: TreeItem;
}

export interface TreeItemInfo {
  name: string;
  isFile: boolean;
  path: string;
  depth: number;
  filesystem: string;
}
export interface TreeItem {
  items: TreeItems;
  name: string;
  isFile: boolean;
}

// TODO(marc2332) Don't use key-value to list the project folders because
// that would make the order change when new folders are added

/*
 * Flat the folder tree into an array
 */
function mapTree(
  list: TreeItemInfo[],
  item: TreeItem,
  depth: number,
  filesystem: string,
) {
  Object.keys(item.items).forEach((item_path) => {
    const itemInfo = item.items[item_path];
    list.push({
      path: item_path,
      name: itemInfo.name,
      isFile: itemInfo.isFile,
      depth,
      filesystem,
    });
    mapTree(list, itemInfo, depth + 1, filesystem);
  });
  return list;
}

/*
 * Remove a specific sub tree in the big tree
 */
function removeSubTreeByPath(tree: TreeItem, path: string): TreeItem {
  Object.keys(tree.items).forEach((item_path) => {
    if (path === item_path) {
      tree.items[item_path].items = {};
    }
    if (path.startsWith(item_path)) {
      removeSubTreeByPath(tree.items[item_path], path);
    }
  });
  return tree;
}

/*
 * Add items to a subtree
 */
function addItemsToSubTreeByPath(
  tree: TreeItem,
  path: string,
  subTreeItems: TreeItems,
): TreeItem {
  Object.keys(tree.items).forEach((item_path) => {
    if (path === item_path) {
      tree.items[item_path].items = subTreeItems;
      return;
    }
    if (path.startsWith(item_path)) {
      addItemsToSubTreeByPath(tree.items[item_path], path, subTreeItems);
    }
  });
  return tree;
}

/*
 * Check if the subtree in the tree is opened or not
 */
function isSubTreeByPathOpened(tree: TreeItem, path: string): boolean {
  let res = false;
  Object.keys(tree.items).forEach((item_path) => {
    if (path === item_path) {
      if (Object.keys(tree.items[item_path].items).length > 0) {
        res = true;
        return;
      }
    }
    if (path.startsWith(item_path) && res === false) {
      res = isSubTreeByPathOpened(tree.items[item_path], path);
      return;
    }
  });
  return res;
}

/*
 * Convert a Items Info List into a TreeItems
 */
function mapItemsListToSubTreeItem(items: DirItemInfo[]): TreeItems {
  const subTreeItems: TreeItems = {};

  items.forEach(
    (item) => {
      subTreeItems[item.path] = {
        name: item.name,
        isFile: item.is_file,
        items: {},
      };
    },
  );

  return subTreeItems;
}

function FilesystemExplorer({
  folders,
  onSelected,
  tree = {
    name: "/",
    isFile: false,
    items: {},
  },
  saveTree,
}: ExplorerOptions) {
  const client = useRecoilValue(clientState);
  const folderItems = mapTree([], tree, 0, "local");
  const [recentlyOpenedItem, setRecentlyOpenedItem] = useState<
    TreeItemInfo | null
  >(null);

  const folderTree = tree;

  useEffect(() => {
    const subTree: TreeItem = {
      name: "/",
      isFile: false,
      items: {},
    };

    // Load the given initial route
    folders.forEach(({ path, filesystem }) => {
      if (folderTree.name === basename(path)) {
        // Folder is the root one
        subTree.items[path] = {
          ...folderTree,
        };
      } else if (path in folderTree.items) {
        // There are multiple folders
        subTree.items[path] = {
          ...folderTree.items[path],
        };
      } else {
        // If folder is not found, then open it
        client.list_dir_by_path(path, filesystem).then((pathItems) => {
          if (pathItems.Ok != null) {
            if (folders.length > 1) {
              subTree.items[path] = {
                name: basename(path),
                isFile: false,
                items: mapItemsListToSubTreeItem(pathItems.Ok),
              };
            } else {
              subTree.name = basename(path);
              subTree.items = mapItemsListToSubTreeItem(pathItems.Ok);
            }
            saveTree?.(subTree);
          } else {
            // handle error
          }
        });
      }
    });
  }, [folders]);

  function closeFolder(item: TreeItemInfo) {
    // Close the sub tree
    const newFolderTree = removeSubTreeByPath(folderTree, item.path);
    saveTree?.({ ...newFolderTree });
  }

  function openFolder(item: TreeItemInfo) {
    // Open the folder
    client.list_dir_by_path(item.path, item.filesystem).then((pathItems) => {
      if (pathItems.Ok) {
        const subTreeItems: TreeItems = mapItemsListToSubTreeItem(pathItems.Ok);

        // Add the new items to the sub tree
        addItemsToSubTreeByPath(folderTree, item.path, subTreeItems);
        setRecentlyOpenedItem(item);
        setTimeout(() => {
          setRecentlyOpenedItem(null);
        }, 60);
      } else {
        // handle error
      }
    });
  }

  return (
    <ExplorerContainer>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => {
          return (
            <List
              itemCount={folderItems.length}
              width={width}
              height={height}
              itemSize={26}
              overscanCount={10}
            >
              {(props: { index: number; style: Record<string, string> }) => {
                const itemPath = folderItems[props.index].path;
                const unixItemPath = itemPath.replace(/\\/g, "/");
                const itemParentPath = dirname(unixItemPath);
                const recentlyOpenedItemUnixPath = recentlyOpenedItem?.path
                  .replace(/\\/g, "/");
                const recentlyOpenedItems =
                  recentlyOpenedItemUnixPath === itemParentPath;
                const recentlyOpened =
                  recentlyOpenedItemUnixPath === unixItemPath;
                return (
                  <ListItem
                    {...props}
                    recentlyOpenedItems={recentlyOpenedItems}
                    recentlyOpened={recentlyOpened}
                    folderItems={folderItems}
                    folderTree={folderTree}
                    onSelected={onSelected}
                    openFolder={openFolder}
                    closeFolder={closeFolder}
                  />
                );
              }}
            </List>
          );
        }}
      </AutoSizer>
    </ExplorerContainer>
  );
}

interface ListItemProps {
  folderItems: TreeItemInfo[];
  index: number;
  style: Record<string, string>;
  folderTree: TreeItem;
  onSelected: (item: TreeItemInfo) => void;
  closeFolder: (item: TreeItemInfo) => void;
  openFolder: (item: TreeItemInfo) => void;
  recentlyOpened: boolean;
  recentlyOpenedItems: boolean;
}

function ListItem(
  {
    index,
    style,
    folderItems,
    folderTree,
    onSelected,
    closeFolder,
    openFolder,
    recentlyOpenedItems,
    recentlyOpened,
  }: ListItemProps,
) {
  const itemInfo = folderItems[index];
  const itemStyle = {
    ...style,
    marginLeft: itemInfo.depth * 10,
  };
  const isOpened = isSubTreeByPathOpened(folderTree, itemInfo.path);
  const { pushContextMenu } = useContextMenu();

  // When the item is clicked
  function onClick() {
    // Trigger the selected callback
    onSelected(itemInfo);

    // If folder
    if (!itemInfo.isFile) {
      if (isOpened) {
        // Close itself
        closeFolder(itemInfo);
      } else {
        // Open itself
        openFolder(itemInfo);
      }
    }
  }

  function onContextMenu(ev: React.MouseEvent) {
    pushContextMenu({
      x: ev.pageX,
      y: ev.pageY,
      menus: [
        {
          label: {
            text: "Open",
          },
          action() {
            onClick();
            return false;
          },
        },
        {
          label: {
            text: "CopyPath",
          },
          action() {
            navigator.clipboard.writeText(itemInfo.path);
            return false;
          },
        },
      ],
    });
  }

  return (
    <ExplorerItem
      recentlyOpened={recentlyOpened}
      recentlyOpenedItems={recentlyOpenedItems}
      key={itemInfo.path}
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={itemStyle}
      isFile={itemInfo.isFile}
      isOpened={isOpened}
      title={itemInfo.path}
    >
      {!itemInfo.isFile && (
        <ReactSVG src="/icons/collapse_arrow.svg" className="arrow" />
      )}
      <FileIcon item={itemInfo} isOpened={isOpened} />
      <span>{itemInfo.name}</span>
    </ExplorerItem>
  );
}

export default FilesystemExplorer;
