import requirePath from '../utils/require'
import StaticConfig from 'StaticConfig'
import Explorer from '../constructors/explorer'
import RunningConfig from 'RunningConfig'
import parseDirectory from './directory.parser'
import InputDialog from '../constructors/dialog.input'
import Tab from '../constructors/tab'
import Editor from '../constructors/editor'
import ExtensionsRegistry from 'ExtensionsRegistry'
import getFormat from './format.parser'

const path = requirePath("path")
const fs = requirePath("fs-extra")

function selectFolderDialog(){
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

function selectFileDialog(){
	return new Promise((resolve, reject) => {
		const { dialog , getCurrentWindow} = requirePath("electron").remote;
		dialog
			.showOpenDialog(getCurrentWindow(), {
			properties: ["openFile"]
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

function openFolder(){
    return new Promise((resolve, reject) => {
        selectFolderDialog().then(function(res){
            if(!StaticConfig.data.log.filter((a)=>a.directory ==res)[0]){
                StaticConfig.data.log.splice(0, 0, {
                    directory:res
                })
                StaticConfig.data.log.join()
            }
            StaticConfig.triggerChange()
            resolve(res)
        }).catch(err => {
            reject(err)
        });
    })
}

function openFile(){
    return new Promise((resolve, reject) => {
        selectFileDialog().then(function(res){
            resolve(res)
        }).catch(err => {
            reject(err)
        });
    })
}

function getWorkspaceConfig( path ){
    let error = false
    try{
        require(path)
    }catch{
        error=true
    }
    if(!error) {
        return require(path)
    }else{
        return null
    }
}

RunningConfig.on('loadFile',function({
    filePath
}){
	const basename = path.basename(filePath)
	const fileFolderPath = path.parse(filePath).dir
	const fileExtension = getFormat(filePath)
	const { bodyElement, tabElement, tabState, isCancelled } = new Tab({
		title:basename,
		directory:filePath,
		parentFolder:fileFolderPath
	})
	if( isCancelled ) return; //Cancels the tab opening
	fs.readFile(filePath,'UTF-8').then(function(data){
		new Editor({
			language:fileExtension,
			value:data ,
			theme:ExtensionsRegistry.registry.data.list[StaticConfig.data.theme].textTheme,
			bodyElement,
			tabElement,
			tabState,
			directory:filePath
		})
	})
});

RunningConfig.on('addFolderToRunningWorkspace',function({
    folderPath,
    replaceOldExplorer = false,
    workspacePath = RunningConfig.data.workspacePath
}){
    new Explorer(folderPath,document.getElementById("sidepanel"),0,replaceOldExplorer)

    RunningConfig.data.workspaceConfig.folders.push({
        name:parseDirectory(folderPath),
        path:folderPath
    })
    
    if(workspacePath != null) {
        RunningConfig.emit('saveCurrentWorkspace')
    }else{
        RunningConfig.data.workspacePath = null
    }
});

RunningConfig.on('addFolderToRunningWorkspaceDialog',function({
    replaceOldExplorer = false
}){
    selectFolderDialog().then(function(folderPath){
        RunningConfig.emit('addFolderToRunningWorkspace',{
            folderPath,
            replaceOldExplorer,
            workspacePath : RunningConfig.data.workspacePath
        })
    }).catch(err => {
        console.log(err)
    });
})

RunningConfig.on('removeFolderFromRunningWorkspace',function({
    folderPath
}){
    RunningConfig.data.workspaceConfig.folders.map(({path},index)=>{
        if( path == folderPath ){
            RunningConfig.data.workspaceConfig.folders.splice(index,1)
        }
    })
});

RunningConfig.on('setWorkspace',({ path })=>{
    const workspace = getWorkspaceConfig(path)

    if( workspace != null){
        RunningConfig.data.workspaceConfig = {
            name: workspace.name,
            folders:[]
        }
        RunningConfig.data.workspacePath = path
        document.getElementById('sidepanel').innerHTML = ""
    
        workspace.folders.map(function(folder){
    
            RunningConfig.emit('addFolderToRunningWorkspace',{
                folderPath:folder.path
            })
        })
    }
})

RunningConfig.on('openWorkspaceDialog',()=>{
    selectFileDialog().then(function(path){
        RunningConfig.emit('addLogWorkspace',{path})
        RunningConfig.emit('setWorkspace',{path})
    }).catch(function(err){
        console.log(err)
    })
})

RunningConfig.on('addLogWorkspace',({ path })=>{

    let noMatches = true;
    StaticConfig.data.recentWorkspaces.map((workspace)=>{
        if(workspace == path) return noMatches = false
    })
    if(noMatches){
        StaticConfig.data.recentWorkspaces.push(path)
        StaticConfig.triggerChange()
    }
})

function saveConfiguration(path,config){
    fs.writeFile(path,JSON.stringify(config,2),'UTF-8', (err, data) => {
        if (err) throw err;
        StaticConfig.triggerChange()
    });
}

RunningConfig.on('saveCurrentWorkspace',function(){
    if(RunningConfig.data.workspacePath != null){

        saveConfiguration(
            RunningConfig.data.workspacePath,
            RunningConfig.data.workspaceConfig
        )

    }else{
        selectFolderDialog().then(function(res){
            new InputDialog({
                title:'Name your workspace',
                placeHolder:'My workspace'
            }).then(function(name){
                const resultWorkspace = path.join(res,'gv-workspace.json')

                RunningConfig.data.workspacePath = resultWorkspace

                RunningConfig.data.workspaceConfig.name = name

                saveConfiguration(
                    RunningConfig.data.workspacePath,
                    RunningConfig.data.workspaceConfig
                )

                RunningConfig.emit('addLogWorkspace',{ path: resultWorkspace})
            })   
        })
    }
})

RunningConfig.on('removeWorkspaceFromLog',({ path:workspacePath })=>{
    const index = (function(){
        let index = 0;
        StaticConfig.data.recentWorkspaces.forEach(({path},i)=>{
            if(path == workspacePath) return index = i;
        })
        return index
    })()
    StaticConfig.data.recentWorkspaces.splice(index,1)
    StaticConfig.triggerChange()
})

RunningConfig.on('renameWorkspace',({ path:workspacePath,name="" })=>{
    const workspaceConfig = getWorkspaceConfig(workspacePath)

    if( workspaceConfig != null ){
        workspaceConfig.name = name
   
        saveConfiguration(
            workspacePath,
            workspaceConfig
        )
    }
});

RunningConfig.on('renameWorkspaceDialog',({ path:workspacePath, onFinished=()=>{} })=>{
    new InputDialog({
        title:'Rename your workspace',
        placeHolder:'My other workspace'
    }).then(function(name){

        RunningConfig.emit('renameWorkspace',{
            path:workspacePath,
            name
        })

        onFinished(name)
    }).catch(function(err){

    })
})

export { 
	getWorkspaceConfig,
	openFolder,
	openFile
}