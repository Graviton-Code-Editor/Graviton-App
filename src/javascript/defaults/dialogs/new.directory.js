import InputDialog from '../../constructors/dialog.input'
import requirePath from '../../utils/require'
import path from 'path'

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
            }
        }else{
            fs.writeFile(dir, '', (err) => {
                if (err) throw err;
                explorerContainer.state.emit('doReload')
            }); 
        }     
    }
    
}

export default newDirectoryDialog