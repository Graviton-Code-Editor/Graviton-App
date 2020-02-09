import requirePath from '../utils/require'
import StaticConfig from 'StaticConfig'

function openFolder(){
    return new Promise((resolve, reject) => {
        const { dialog , getCurrentWindow} = requirePath("electron").remote;
        dialog
            .showOpenDialog(getCurrentWindow(), {
                properties: ["openDirectory"]
            })
            .then(result => {
                if (result.canceled) return;
                
                if(!StaticConfig.data.log.filter((a)=>a.directory ==result.filePaths[0])[0]){
                    StaticConfig.data.log.push({
                        directory:result.filePaths[0]
                    })
                }
               
                StaticConfig.triggerChange()
                resolve(result.filePaths[0])
            })
            .catch(err => {
             reject(err)
            });
    })
}

export { openFolder }