import InputDialog from '../../constructors/dialog.input'
import requirePath from '../../utils/require'
const path = requirePath("path")
import RunningConfig from 'RunningConfig'

const fs = requirePath("fs-extra")

function newDirectoryDialog({
    isFolder,
    parentDirectory,
    explorerContainer
}){
    new InputDialog({
        title:isFolder?'New Folder':'New file',
        placeHolder:isFolder?'Folder':'File',
    }).then(function(res){
        createDirectory(res,isFolder,parentDirectory,explorerContainer)
    }).catch(function(){

    })
}

function createDirectory(value,isFolder,parentDirectory,explorerContainer){
    const dir = path.join(parentDirectory,value)
    if (!fs.existsSync(dir)){
        if(isFolder){
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
                explorerContainer.state.emit('doReload')
              	RunningConfig.emit('aFolderHasBeenCreated',{
                  path:dir,
                  parentFolder:path.normalize(explorerContainer.getAttribute("parentfolder"))
                })
            }
        }else{
            fs.writeFile(dir, '', (err) => {
                if (err) throw err;
                explorerContainer.state.emit('doReload')
                RunningConfig.emit('aFileHasBeenCreated',{
                  path:dir,
                  parentFolder:path.normalize(explorerContainer.getAttribute("parentfolder"))
                })
            }); 
          	
        }     
    }
    
}

export default newDirectoryDialog