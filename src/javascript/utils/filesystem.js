import StaticConfig from 'StaticConfig'
import Explorer from '../constructors/explorer'
import RunningConfig from 'RunningConfig'
import parseDirectory from './directory.parser'
import InputDialog from '../constructors/dialog.input'
import Tab from '../constructors/tab'
import Editor from '../constructors/editor'
import PluginsRegistry from 'PluginsRegistry'
import getFormat from './format.parser'
import normalizeDir from  './directory.normalizer'
import selectFolderDialog from './dialogs/select.folder'
import selectFileDialog from './dialogs/select.file'

const path = window.require("path")
const fs = window.require("fs-extra")
const { remote } = window.require("electron")

function openFolder(){
	return new Promise((resolve, reject) => {
		selectFolderDialog().then(function(res){
			if(!StaticConfig.data.appProjectsLog.find((a)=>a.directory ==res)){
				StaticConfig.data.appProjectsLog.splice(0, 0, {
					directory:res
				})
				StaticConfig.data.appProjectsLog.join()
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
		require(normalizeDir(path))
	}catch{
		error=true
	}
	if(!error) {
		return require(normalizeDir(path))
	}else{
		return null
	}
}

RunningConfig.on('loadFile',function({
	filePath
}){
	const fileDir = normalizeDir(filePath)
	const basename = path.basename(fileDir)
	const fileFolderPath = path.parse(fileDir).dir
	const fileExtension = getFormat(fileDir)
	const { bodyElement, tabElement, tabState, isCancelled } = new Tab({
		title:basename,
		directory:fileDir,
		parentFolder:fileFolderPath
	})
	if( isCancelled ) return; //Cancels the tab opening
	fs.readFile(fileDir,'UTF-8').then(function(data){
		new Editor({
			language:fileExtension,
			value:data ,
			theme:PluginsRegistry.registry.data.list[StaticConfig.data.appTheme].textTheme,
			bodyElement,
			tabElement,
			tabState,
			directory:fileDir
		})
	})
});

RunningConfig.on('addFolderToRunningWorkspace',function({
	folderPath,
	replaceOldExplorer = false,
	workspacePath = RunningConfig.data.workspacePath
}){
	const folderDir = normalizeDir(folderPath)
	Explorer(folderDir,document.getElementById("sidepanel"),0,replaceOldExplorer)
	RunningConfig.data.workspaceConfig.folders.push({
		name:parseDirectory(folderDir),
		path:folderDir
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
	const folderDir = normalizeDir(folderPath)
	RunningConfig.data.workspaceConfig.folders.map(({path},index)=>{
		if( path == folderDir ){
			RunningConfig.data.workspaceConfig.folders.splice(index,1)
		}
	})
});

RunningConfig.on('setWorkspace',({ path:workspaceDir })=>{
	const workspacePath = normalizeDir(workspaceDir)
	const workspace = getWorkspaceConfig(workspacePath)
	if( workspace != null){
		RunningConfig.data.workspaceConfig = {
			name: workspace.name,
			folders:[]
		}
		RunningConfig.data.workspacePath = workspacePath
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

RunningConfig.on('addLogWorkspace',({ path:workspaceDir })=>{
	const workspacePath = normalizeDir(workspaceDir)
	let noMatches = true;
	StaticConfig.data.appWorkspacesLog.map((workspace)=>{
		if(workspace == workspacePath) return noMatches = false
	})
	if(noMatches){
		StaticConfig.data.appWorkspacesLog.push(workspacePath)
		StaticConfig.triggerChange()
	}
})

function saveConfiguration(configDir,config){
	const configPath = normalizeDir(configDir)
	fs.writeFile(configPath,JSON.stringify(config,null,2),'UTF-8', (err, data) => {
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
		StaticConfig.data.appWorkspacesLog.forEach(({path},i)=>{
			if(path == workspacePath) return index = i;
		})
		return index
	})()
	StaticConfig.data.appWorkspacesLog.splice(index,1)
	StaticConfig.triggerChange()
})

RunningConfig.on('renameWorkspace',({ path:workspacePath,name="" })=>{
	const workspaceConfig = getWorkspaceConfig(normalizeDir(workspacePath))
	if( workspaceConfig != null ){
		workspaceConfig.name = name
		saveConfiguration(
			workspacePath,
			workspaceConfig
		)
	}
});

RunningConfig.on('renameWorkspaceDialog',({ path:workspaceDir, name='My other workspace', onFinished=()=>{} })=>{
	const workspacePath = normalizeDir(workspacePath)
	new InputDialog({
		title:'Rename your workspace',
		placeHolder:name
	}).then(function(name){
		RunningConfig.emit('renameWorkspace',{
			path:workspacePath,
			name
		})
		onFinished(name)
	}).catch(function(err){
		console.log(err)
	})
})

export { 
	getWorkspaceConfig,
	openFolder,
	openFile
}