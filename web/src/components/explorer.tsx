import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components'
import { clientState } from '../utils/atoms';

const Explorer = styled.div`
    padding: 10px;
`

interface ExplorerOptions {
    // Route where the explorer opens in
    initialRoute: string,
    onSelected: (path: string) => void
}

function FilesystemExplorer({ initialRoute, onSelected }: ExplorerOptions) {

    const client = useRecoilValue(clientState);
    const [currentPath, setCurrentPath] = useState(initialRoute);
    const [currentPathItems, setCurrentPathItems] = useState<string[]>([]);
    const [selectedPath, setSelectedPath] = useState<string | null>(null);

    function selectPath() {
        if (selectedPath != null) {
            onSelected(selectedPath)
        }
    }

    useEffect(() => {
        client.list_dir_by_path(currentPath, "local", 1).then((pathItems) => {
            if (pathItems.Ok) {
                setCurrentPathItems(pathItems.Ok);
            } else {
                // handle error
            }
        })
    }, [currentPath])

    return (
        <Explorer>
            <div>
                {currentPathItems.map(path => {
                    return <button key={path} onClick={() => setCurrentPath(path)} onMouseOver={() => setSelectedPath(path)}> {path} </button>
                })}
            </div>
            <b>{selectedPath}</b>
            <button onClick={selectPath}>Open</button>
        </Explorer>
    )
}

export default FilesystemExplorer;