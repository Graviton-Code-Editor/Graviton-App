import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { default as styled } from "styled-components";
import { clientState } from "../utils/atoms";
//@ts-ignore
import { FixedSizeList as List } from "react-window";
//@ts-ignore
import AutoSizer from "react-virtualized-auto-sizer";
import { DirItemInfo } from "../utils/client";
import { ReactSVG } from "react-svg";

const ExplorerContainer = styled(AutoSizer)``;

const ExplorerItemContainer = styled.div<{
  isFile: boolean;
  isOpened: boolean;
}>`
  max-width: 300px;
  display: flex;
  align-items: center;
  margin: 5px;
  ${({ isFile }) => isFile && "margin-left: 22px;"}
  & > button {
    margin: 1px;
    cursor: pointer;
    outline: 0;
    white-space: nowrap;
    position: relative;
    background: ${({ theme }) => theme.elements.explorer.item.background};
    color: ${({ theme }) => theme.elements.explorer.item.text.color};
    font-size: 12px;
    border-radius: 5px;
    line-break: none;
    text-overflow: elliptic;
    overflow: hidden;
    padding: 6px;
    border: none;
    min-width: 170px;
    max-width: 200px;
    text-align: left;
    user-select: none;
    &:hover {
      background: ${({ theme }) =>
        theme.elements.explorer.item.hover.background};
    }
  }
  & svg {
    fill: ${({ theme }) => theme.elements.explorer.item.arrow.fill};
    margin-right: 7px;
    margin-left: 3px;
    width: 7px;
    transform: ${({ isOpened }) =>
      isOpened ? " rotate(90deg)" : " rotate(0deg)"};
  }
`;

interface ExplorerOptions {
  // Route where the explorer opens in
  initialRoute: string;
  // Name of the FS installed in the Core
  filesystem_name: string;
  // Callback executed when a item is clicked
  onSelected: (path: TreeItemInfo) => void;
}

interface TreeItems {
  [key: string]: TreeItem;
}

export interface TreeItemInfo {
  name: string;
  isFile: boolean;
  path: string;
  depth: number;
}
interface TreeItem {
  items: TreeItems;
  name: string;
  isFile: boolean;
}

/*
 * Flat the folder tree into an array
 */
function mapTree(list: TreeItemInfo[], item: TreeItem, depth: number) {
  Object.keys(item.items).forEach((item_path) => {
    const itemInfo = item.items[item_path];
    list.push({
      path: item_path,
      name: itemInfo.name,
      isFile: itemInfo.isFile,
      depth,
    });
    mapTree(list, itemInfo, depth + 1);
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
  subTreeItems: TreeItems
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
    if (path.startsWith(item_path)) {
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
    (item) =>
      (subTreeItems[item.path] = {
        name: item.name,
        isFile: item.is_file,
        items: {},
      })
  );

  return subTreeItems;
}

function FilesystemExplorer({
  initialRoute,
  onSelected,
  filesystem_name,
}: ExplorerOptions) {
  const client = useRecoilValue(clientState);
  const defaultState: [TreeItem, TreeItemInfo[]] = [
    {
      name: initialRoute,
      isFile: false,
      items: {},
    },
    [],
  ];
  const [[folderTree, folderItems], setFolderData] = useState(defaultState);

  useEffect(() => {
    // Load the given initial route
    client.list_dir_by_path(initialRoute, filesystem_name).then((pathItems) => {
      if (pathItems.Ok) {
        const subTree: TreeItem = {
          name: initialRoute,
          isFile: false,
          items: mapItemsListToSubTreeItem(pathItems.Ok),
        };
        setFolderData([subTree, mapTree([], subTree, 0)]);
      } else {
        // handle error
      }
    });
  }, []);

  function closeFolder(path: string) {
    // Open the folder
    client.list_dir_by_path(path, filesystem_name).then((pathItems) => {
      if (pathItems.Ok) {
        const subTreeItems: TreeItems = mapItemsListToSubTreeItem(pathItems.Ok);

        // Add the new items to the sub tree
        addItemsToSubTreeByPath(folderTree, path, subTreeItems);

        setFolderData([{ ...folderTree }, mapTree([], folderTree, 0)]);
      } else {
        // handle error
      }
    });
  }

  function openFolder(path: string) {
    // Close the sub tree
    const newFolderTree = removeSubTreeByPath(folderTree, path);
    setFolderData([{ ...newFolderTree }, mapTree([], newFolderTree, 0)]);
  }

  function ListItem({ index, style }: { index: number; style: any }) {
    const itemInfo = folderItems[index];
    const itemStyle = {
      ...style,
      paddingLeft: itemInfo.depth * 10,
    };
    const isOpened = isSubTreeByPathOpened(folderTree, itemInfo.path);

    // When the item is clicked
    function onClick() {
      if (itemInfo.isFile) {
        // Trigger the select callback
        onSelected(itemInfo);
      } else {
        if (isOpened) {
          // Close itself
          openFolder(itemInfo.path);
        } else {
          // Open itself
          closeFolder(itemInfo.path);
        }
      }
    }

    return (
      <ExplorerItemContainer
        key={itemInfo.path}
        onClick={onClick}
        style={itemStyle}
        isFile={itemInfo.isFile}
        isOpened={isOpened}
      >
        {!itemInfo.isFile && <ReactSVG src="./src/icons/collapse_arrow.svg" />}
        <button>{itemInfo.name}</button>
      </ExplorerItemContainer>
    );
  }

  return (
    <ExplorerContainer>
      {({ height, width }: { height: number; width: number }) => {
        return (
          <List
            itemCount={folderItems.length}
            width={width}
            height={height}
            itemSize={26}
            overscanCount={10}
          >
            {ListItem}
          </List>
        );
      }}
    </ExplorerContainer>
  );
}

export default FilesystemExplorer;
