import { puffin } from '@mkenzo_8/puffin'
import Item from '../components/explorer/item'
import parseDirectory from '../utils/directory.parser'
import normalizeDir from  '../utils/directory.normalizer'
import beautifyDir from  '../utils/directory.beautifier'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import Notification from './notification'
import "babel-polyfill";

const fs = window.require('fs-extra')
const simpleGit = window.require("simple-git")
const chokidar = window.require('chokidar');
const path = window.require('path');

function checkIfProjectIsGit(path){
	if ( path.includes("wsl$") ) return; // Simple-git will throw error "Directory doesn't exist" no matter what.
	const simpleInstance = simpleGit(path)
	return new Promise((resolve,reject)=>{
		simpleInstance.checkIsRepo((err,res)=>{
			if(!err) {
				resolve(res)
			}else{
				reject(err)
			}
		})
	})
}

function getStatus(path){
	const simpleInstance = simpleGit(path)
	return new Promise((resolve,reject)=>{
		simpleInstance.status((err,res)=>{
			resolve(res)
		}) 
	})
}

function createWatcher(dirPath,explorerState){
	const folderPath = normalizeDir( dirPath )	
	const gitWatcherPath = normalizeDir(path.join( folderPath ,'.git','logs','HEAD'))
	const projectWatcher = chokidar.watch( folderPath , {
		ignored: /(.git)|(node_modules)|(dist)|(.cache)/g,
		persistent: true,
		interval: 250,
		ignoreInitial: true
	});
	projectWatcher
		.on('add', filePath => {
			explorerState.emit('newFile',{
				containerFolder:normalizeDir(path.dirname( filePath )),
				fileName:path.basename(filePath)
			})
		})
		.on('change', async fileDir => {
			const filePath = normalizeDir( fileDir )
			explorerState.emit('changedFile',{
				filePath
			})
		})
		.on('unlink', fileDir =>{
			const filePath = normalizeDir( fileDir )
			explorerState.emit('removedFile',{
				filePath
			})
		})
		.on('addDir', folderPath => {
			explorerState.emit('newFolder',{
				containerFolder: normalizeDir(path.dirname( folderPath )),
				folderName: path.basename(folderPath)
			})
		})
		.on('unlinkDir', folderDir => {
			const folderPath = normalizeDir( folderDir )
			explorerState.emit('removedFolder',{
				folderPath
			})
		})
	const gitWatcher = chokidar.watch( gitWatcherPath, {
		persistent: true,
		interval: 400,
		ignoreInitial: true
	});
	gitWatcher.on('change',async () => {
		const gitChanges = await getStatus( folderPath )
		RunningConfig.emit('gitStatusUpdated',{
			gitChanges,
			branch: gitChanges.current,
			parentFolder: folderPath,
			anyChanges: gitChanges.files.length > 0
		})
	})
	return {
		projectWatcher,
		gitWatcher
	}
}

function getlastFolderPosition(container){
	const items = container.children
	return Object.keys(items).find((index)=>{
		const item = items[index]
		return item.getAttribute("isDirectory") == "false"? index : null
	})
}


async function Explorer(folderPath, parent, level = 0, replaceOldExplorer = true, gitChanges = null ){
	const parsedFolderPath = normalizeDir(folderPath,true)
	if(level == 0){
		let gitResult = await checkIfProjectIsGit(parsedFolderPath)
		if( gitResult ) {
			gitChanges = await getStatus(parsedFolderPath)
			RunningConfig.emit('loadedGitRepo',{
				gitChanges,
				branch: gitChanges.current,
				parentFolder: parsedFolderPath,
				anyChanges: gitChanges.files.length > 0
			})
			
		}
		const itemComputed = getItemComputed({
			projectPath: folderPath,
			folderPath,
			dirName: parseDirectory(folderPath),
			dirPath: normalizeDir(folderPath),
			level:0,
			isFolder: true
		})
		const explorerContainer = puffin.element(
			itemComputed
			 ,{
				components:{
					Item:Item({
						parentFolder: parsedFolderPath,
						explorerContainer: null
					})
			},
			events:{
				mounted:async function(){
					const explorerState = this.state
					let projectWatcher = null;
					let gitWatcher = null;
					explorerState.emit('doReload')
					this.gitChanges = gitChanges
					RunningConfig.on(['aTabHasBeenSaved','aFileHasBeenCreated','aFolderHasBeenCreated','aFileHasBeenRemoved','aFolderHasBeenRemoved'],async ({parentFolder}) => {
						if( gitResult && parentFolder == folderPath) {
							const gitChanges =  await getStatus(folderPath)
							RunningConfig.emit('gitStatusUpdated',{
								gitChanges,
								parentFolder,
								branch:gitChanges.current,
								anyChanges:gitChanges.files.length > 0
							})
						}
					})
					if( gitResult ){
						explorerState.emit('gitMarkProjectContainer',{ //Force to mark as modified the project item
							gitChanges: await getStatus(folderPath),
							containerFolder: folderPath
						})
					}
					/*
					* The filesystem watcher is only ignoring node_modules, .git,dist and .cache folders for now.
					* The Git watcher just watchs the commit message file.
					*/
					explorerState.on('stopedWatcher',() => {
						if( projectWatcher ){
							projectWatcher.close();
							projectWatcher = null;
						}
						if( gitWatcher ){
							gitWatcher.close();
							gitWatcher = null;
						}
					})
					explorerState.on('startedWatcher',() => {
						if( projectWatcher == null ){
							const watchers = createWatcher(folderPath,explorerState)
							projectWatcher = watchers.projectWatcher
							gitWatcher = watchers.gitWatcher
						}
					})
					StaticConfig.on('stopWatchers',() => {
						explorerState.emit('stopedWatcher')
					})
					StaticConfig.on('startWatchers',() => {
						explorerState.emit('startedWatcher')
					})
					if( StaticConfig.data.enableFileSystemWatcher ){
						explorerState.emit('startedWatcher')
					}
					if( StaticConfig.data.editorFSWatcher ) explorerState.emit('startedWatcher')
					explorerState.on('createItem',({container,containerFolder,directory,directoryName,level,isFolder = false})=>{
						if( container === null) return; //Folder is not opened
						const possibleClass = normalizeDir(directory)
						if(document.getElementsByClassName(possibleClass)[0] == null){ //Might have been already created by watcher
							if( isFolder ){
								RunningConfig.emit('aFolderHasBeenCreated',{
									parentFolder:parsedFolderPath,
									path:directory
								})
							}else{
								RunningConfig.emit('aFileHasBeenCreated',{
									parentFolder:parsedFolderPath,
									path:directory
								})
							}
							const itemComputed = getItemComputed({
								projectPath: parsedFolderPath,
								classSelector: possibleClass,
								dirName: directoryName,
								dirPath: directory,
								level: Number(level)+1,
								isFolder
							}) 
							const hotItem = puffin.element(itemComputed,{
								components:{
									Item:Item({parentFolder:parsedFolderPath,explorerContainer:container.explorerContainer})
								}
							})
							if( container.children[1]){ //Check if the folder is opened
								if( isFolder ){
									const folderPosition = getlastFolderPosition(container.children[1])
									puffin.render(hotItem,container.children[1],{
										position:folderPosition
									})
								}else{
									puffin.render(hotItem,container.children[1])
								}
							}
						}
					})
				}
			}
		})
		if( replaceOldExplorer && parent.children[0] ){
			for( let otherExplorer of parent.children){
				RunningConfig.emit('removeFolderFromRunningWorkspace',{
					folderPath:otherExplorer.getAttribute("fullpath")
				})
			}
		}
		puffin.render(explorerContainer,parent,{
			removeContent:replaceOldExplorer
		})
	}
	fs.readdir(path.normalize(parsedFolderPath)).then( paths => {
		const explorerComponent = puffin.element(`
			<div style="padding:0px 7px;">
				${paths.map( dir => { //Load folders 
					const itemDirectory = normalizeDir (path.join(folderPath,dir) )
					if( fs.lstatSync(path.join(parsedFolderPath,dir)).isDirectory() )
						return getItemComputed({
							projectPath: parent.getAttribute("parentFolder"),
							classSelector: folderPath,
							dirName: dir,
							dirPath: itemDirectory,
							level,
							isFolder: true
						}) 
				}).join("")}
				${paths.map( dir => { //Load files 
					const itemDirectory = normalizeDir( path.join(folderPath,dir) )
					if(!fs.lstatSync( path.join(parsedFolderPath,dir)).isDirectory() )
						if(! dir.match("~") )
							return getItemComputed({
								projectPath: parent.getAttribute("parentFolder"),
								classSelector: folderPath,
								dirName: dir,
								dirPath: itemDirectory,
								level,
								isFolder: false
							}) 
				}).join("")}
			</div>
		`,{
			components:{
				Item:Item({
					parentFolder: parsedFolderPath,
					explorerContainer: parent.explorerContainer
				})
			},
			events:{
				mounted(){
					this.gitChanges = gitChanges
				}
			}
		})
		if(level != 0){
			puffin.render(explorerComponent,parent,{
				removeContent:false
			})
		}
	}).catch( err => {
		console.error(err)
		new Notification({
			title:'Error',
			content:err
		})
	})    
}


function getItemComputed({
	classSelector="",
	projectPath,
	dirName,
	dirPath,
	level,
	isFolder
}){
	return `<Item ${projectPath?`id="${normalizeDir(projectPath)}"`:''} class="${classSelector}" isFolder="${isFolder}" parentFolder="${projectPath}" dirName="${dirName}" hint="${beautifyDir(dirPath)}" fullpath="${dirPath}" level="${level}"/>` 
}



export default Explorer