import InputDialog from '../../constructors/dialog.input'
import requirePath from '../../utils/require'
import RunningConfig from 'RunningConfig'
import normalizeDir from  '../../utils/directory.normalizer'

const fs = requirePath("fs-extra")
const path = requirePath("path")

function newDirectoryDialog({
	isFolder,
	parentDirectory,
	container,
	explorerState
}){
	new InputDialog({
		title:isFolder?'New Folder':'New file',
		placeHolder:isFolder?'Folder':'File',
	}).then(function(res){
		createDirectory(res,isFolder,parentDirectory,container,explorerState)
	}).catch(function(){
		//Do nothing since there is nothing to create
	})
}

function createDirectory(value,isFolder,parentDirectory,container,explorerState){
	const dir = path.join(parentDirectory,value)
	if (!fs.existsSync(dir)){
		if(isFolder){
			if (!fs.existsSync(dir)){
				fs.mkdirSync(dir);
				explorerState.emit('createItem',{
					container:container,
					containerFolder:normalizeDir(container.getAttribute("parentfolder")),
					level:container.getAttribute("level"),
					directory:dir,
					directoryName:path.basename(dir),
					isFolder:true
				})
			}
		}else{
			fs.writeFile(dir, '', (err) => {
				if (err) throw err;
				explorerState.emit('createItem',{
					container:container,
					containerFolder:normalizeDir(container.getAttribute("parentfolder")),
					level:container.getAttribute("level"),
					directory:dir,
					directoryName:path.basename(dir),
					isFolder:false
				})
			}); 
		}     
	}
}

export default newDirectoryDialog