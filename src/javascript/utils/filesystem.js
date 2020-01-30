import requirePath from '../utils/require'

function openFolder(){
    return new Promise((resolve, reject) => {
        const { dialog , getCurrentWindow} = requirePath("electron").remote;
        dialog
            .showOpenDialog(getCurrentWindow(), {
                properties: ["openDirectory"]
            })
            .then(result => {
                if (result.canceled) return;
                resolve(result.filePaths[0])
            })
            .catch(err => {
             reject(err)
            });
    })
}

export { openFolder }