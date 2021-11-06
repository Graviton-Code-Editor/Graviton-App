import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components'
import { clientState } from '../utils/atoms';
//@ts-ignore
import { FixedSizeList as List } from "react-window";
//@ts-ignore
import AutoSizer from "react-virtualized-auto-sizer";
import { DirItemInfo } from '../utils/client';


const ExplorerContainer = styled.div`
    padding: 10px;
    overflow: hidden;
`

const ExplorerItemContainer = styled.div`
    max-width: 300px;
    display: flex;
    align-items: center;
    & > button {
        cursor: pointer;
        outline:0;
		white-space:nowrap;
        position:relative;
        background: rgba(0,0,0,0.1);
        border-radius: 5px;
        line-break: none;
        text-overflow: elliptic;
        overflow: hidden;
        padding: 8px;
        border: none;
        width: 150px;
        text-align: left;
    }
`

interface ExplorerOptions {
    // Route where the explorer opens in
    initialRoute: string,
    onSelected: (path: TreeItemInfo) => void
}

interface TreeItems {
    [key: string]: TreeItem
}

export interface TreeItemInfo {
    name: string,
    isFile: boolean,
    path: string,
    depth: number
}
interface TreeItem {
    items: TreeItems,
    name: string,
    isFile: boolean,
}

/*
 * Flat the folder tree into an array
 */
function mapTree(list: TreeItemInfo[], item: TreeItem, depth: number) {
    Object.keys(item.items).forEach(item_path => {
        const itemInfo = item.items[item_path];
        list.push({
            path: item_path,
            name: itemInfo.name,
            isFile: itemInfo.isFile,
            depth
        });
        mapTree(list, itemInfo, depth + 1);
    })
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
    })
    return tree;
}

/*
 * Add items to a subtree
 */
function addItemsToSubTreeByPath(tree: TreeItem, path: string, subTreeItems: TreeItems): TreeItem {
    Object.keys(tree.items).forEach((item_path) => {
        if (path === item_path) {
            tree.items[item_path].items = subTreeItems;
            return;
        }
        if (path.startsWith(item_path)) {
            addItemsToSubTreeByPath(tree.items[item_path], path, subTreeItems);
        }

    })
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
    })
    return res;
}

/*
 * Convert a Items Info List into a TreeItems
 */
function mapItemsListToSubTreeItem(items: DirItemInfo[]): TreeItems {
    const subTreeItems: TreeItems = {};

    items.forEach(item => subTreeItems[item.path] = {
        name: item.name,
        isFile: item.is_file,
        items: {}
    });

    return subTreeItems;
}

function FilesystemExplorer({ initialRoute, onSelected }: ExplorerOptions) {

    const client = useRecoilValue(clientState);
    const defaultState: [TreeItem, TreeItemInfo[]] = [{
        name: initialRoute,
        isFile: false,
        items: {}
    }, []];
    const [[folderTree, folderItems], setFolderData] = useState(defaultState);

    useEffect(() => {
        // Load the given initial route
        client.list_dir_by_path(initialRoute, "local", 1).then((pathItems) => {
            if (pathItems.Ok) {

                const subTree: TreeItem = {
                    name: initialRoute,
                    isFile: false,
                    items: mapItemsListToSubTreeItem(pathItems.Ok)
                };

                setFolderData([subTree, mapTree([], subTree, 0)]);
            } else {
                // handle error
            }
        })
    }, [])

    function openFolder(path: string) {

        const isOpened = isSubTreeByPathOpened(folderTree, path);

        if (isOpened) {
            // Close the sub tree
            const newFolderTree = removeSubTreeByPath(folderTree, path);
            setFolderData([{ ...newFolderTree }, mapTree([], newFolderTree, 0)]);
        } else {
            // Open the folder
            client.list_dir_by_path(path, "local", 1).then((pathItems) => {
                if (pathItems.Ok) {
                    const subTreeItems: TreeItems = mapItemsListToSubTreeItem(pathItems.Ok);

                    // Add the new items to the sub tree 
                    addItemsToSubTreeByPath(folderTree, path, subTreeItems);

                    setFolderData([{ ...folderTree }, mapTree([], folderTree, 0)]);
                } else {
                    // handle error
                }
            })
        }
    }

    function ListItem({ index, style }: { index: number, style: any }) {

        const itemInfo = folderItems[index];
        const itemStyle = {
            ...style,
            paddingLeft: itemInfo.depth * 20,
        };

        // When the item is clicked
        function onClick() {

            if (itemInfo.isFile) {
                // Trigger the select callback
                onSelected(itemInfo)
            } else {
                // Open itself
                openFolder(itemInfo.path)
            }

        }

        return (
            <ExplorerItemContainer key={itemInfo.path} onClick={onClick} style={itemStyle}>
                <button>{itemInfo.name}</button>
            </ExplorerItemContainer>
        )
    }

    return (
        <ExplorerContainer>
            <div style={{ height: 500, width: 500 }}>
                <AutoSizer>
                    {({ height, width }: { height: number, width: number }) => (
                        <List itemCount={folderItems.length} width={width} height={height} itemSize={35} overscanCount={10} >
                            {ListItem}
                        </List>
                    )}
                </AutoSizer>
            </div>
        </ExplorerContainer>
    )
}

export default FilesystemExplorer;