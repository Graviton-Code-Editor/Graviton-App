import { puffin } from '@mkenzo_8/puffin'
import Explorer from '../../constructors/explorer'
import ContextMenu from '../../constructors/contextmenu'
import Tab from '../../constructors/tab'
import Editor from '../../constructors/editor'
import newDirectoryDialog from '../../defaults/dialogs/new.directory'
import areYouSureDialog from '../../defaults/dialogs/you.sure'
import StaticConfig from 'StaticConfig'
import ExtensionsRegistry from 'ExtensionsRegistry'
import RunningConfig from 'RunningConfig'
import Icons from '../../../../assets/icons/**.svg'
import FolderArrow from '../icons/folder.arrow'
import requirePath from '../../utils/require'
import parseDirectory from '../../utils/directory.parser'
import getFormat from '../../utils/format.parser'
import normalizeDir from  '../../utils/directory.normalizer'

const fs = requirePath("fs-extra")
const trash = requirePath("trash")
const path = requirePath("path")

function getMyStatus(fileDir,gitChanges,projectDir){
	const filePath = normalizeDir(fileDir)
	const projectPath = normalizeDir(projectDir)
	const supportedGitStatuses = ["not_added","modified"]
	let result = {
		status:'unknown'
	}
	if(gitChanges){
		if( filePath == projectPath ){
			if( gitChanges.modified.length > 0 ){
				return result = {
					status:"modified"
				}
			}
			if( gitChanges.not_added.length > 0 ){
				return result = {
					status:"not_added"
				}
			}	
		}
		supportedGitStatuses.map((status)=>{
			gitChanges[status].filter((gitPath)=>{
				if( normalizeDir(path.resolve(projectPath,gitPath)) == normalizeDir(filePath) ){
					return result = {
						status:status
					}
				}else{
					const dirsGit =  normalizeDir(gitPath).split(path.sep)
					const dirsLocal = normalizeDir(filePath).split(path.sep)
					dirsGit.filter((dirGit)=>{
						const dirLocal = dirsLocal[dirsLocal.length-1]
						if(dirLocal == dirGit){
							if(normalizeDir(path.resolve(projectPath,gitPath)).indexOf(normalizeDir(filePath)) > -1){
								return result = {
									status:status
								}
							}
						}else{
							return
						}
					})
				}
			})
		}) 
	}
	return result
}

function markStatus(target,status){
	const spanText = target.children[0].children[2]
	const isDirectory = target.getAttribute("isDirectory") == "true"
	switch(status){
		case 'modified':
			target.setAttribute('gitStatus','modified')
			if( !isDirectory) spanText.textContent = `${spanText.getAttribute("originalName")} - M`
			break;
		case 'not_added': //Same as untracked
			target.setAttribute('gitStatus','not_added')
			if( !isDirectory) spanText.textContent = `${spanText.getAttribute("originalName")} - U`
			break;
		default:
			target.setAttribute('gitStatus',null)
			if( !isDirectory) spanText.textContent = spanText.getAttribute("originalName")
	}
}

function Item({
	parentFolder, //Directory parent
	explorerContainer
}){
	const ItemWrapper = puffin.style.div`
		&{
			background:transparent;
			white-space:nowrap;
			padding:0px;
			user-select:none;
		}
		& > button{
			transition:0.07s;
			margin:0;
			border-radius:12px;
			font-size:12px;
			padding:3px 5px;
			border:none;
			margin:0px;
			background:transparent;
			outline:0;
			white-space:nowrap;
			display:flex;
			align-items: center;
			justify-content: center;
			color:var(--explorerItemText);
		}
		& button:hover{
			background:var(--explorerItemHoveringBackground);
			border-radius:5px;
		}
		& [selected=true] button{
			transition:0.07s;
			background:var(--explorerItemSelectedBackground);
			border-radius:5px;
		}
		& > button > *{
			align-items: center;
			display:flex;
			color:var(--explorerItemText);
		}
		& .gitStatus {
			display:none;
			position:relative;
			padding:3px;
			border-radius:50px;
			margin: auto 2px;
			margin-left:6px;
		}
		&[gitStatus="modified"][isDirectory="true"] > button > .gitStatus {
			display:block;
			background:var(--explorerItemGitModifiedIndicator);
		}
		&[gitStatus="modified"] > button > span {
			color:var(--explorerItemGitModifiedIndicator);
		}
		&[gitStatus="not_added"][isDirectory="true"] > button > .gitStatus {
			display:block;
			background:var(--explorerItemGitNotAddedIndicator);
		}
		&[gitStatus="not_added"] > button > span {
			color:var(--explorerItemGitNotAddedText);
		}
		& .icon{
			height:20px;
			width:20px;
			margin-right:4px;
			position:relative;
		}
		& .arrow{
			height:8px;
			width:8px;
			position:relative;
			padding:0px;
			margin-right:3px;
			transition:0.1s;
			border-radius:1px;
		}
		&[opened="true"] .arrow{
			transform:rotate(90deg);
		}
		&[opened="false"] .arrow{
			transform:rotate(0deg);
		}
		`
	const ItemComp = puffin.element(`
		<ItemWrapper selected="false" title="{{fullpath}}">
			<button click="$openDirectory" contextmenu="$contextMenu">
				<FolderArrow class="arrow"/>
				<img class="icon"/>
				<span originalName="{{path}}">{{path}}</span>
				<div class="gitStatus"/>
			</button>
		</ItemWrapper>
		`,{
			props:['path','selected','fullpath'],
			components:{
				ItemWrapper,
				FolderArrow
			},
			methods:{
				openDirectory(e){
					this.parentElement.state.emit('clickItem')
				},
				contextMenu(e){
					if(this.parentElement.getAttribute("isDirectory") == "true"){
						new ContextMenu({
							list:[
								{
									label:"New folder",
									action:()=>{
										const itemContainer = this.parentElement
										newDirectoryDialog({
											isFolder:true,
											parentDirectory:itemContainer.getAttribute("fullpath"),
											container:itemContainer,
											explorerState:document.getElementById(normalizeDir(itemContainer.getAttribute("parentFolder"))).state
										})
									}
								},
								{
									label:"New file",
									action:()=>{
										const itemContainer = this.parentElement
										newDirectoryDialog({
											isFolder:false,
											parentDirectory:itemContainer.getAttribute("fullpath"),
											container:itemContainer,
											explorerState:document.getElementById(normalizeDir(itemContainer.getAttribute("parentFolder"))).state
										})
									}
								},
								{},
								{
									label:"Remove folder",
									action:()=>{
										if(this.parentElement.getAttribute("level")!="0"){
											removeDirectoryOrFile(this)
										} 
									}
								}
							],
							parent:this,
							event:e
						})
					}else{
						new ContextMenu({
							list:[
								{
									label:"Remove file",
									action:()=>{
										removeDirectoryOrFile(this)
									}
								}
							],
							parent:this,
							event:e
						})
					}
				}
			},
			events:{
				mounted(target){
					const isItemFolder = target.getAttribute("isDirectory") == "true"
					const itemState = new puffin.state({})
					target.state = itemState
					const gitChanges = target.parentElement.parentElement.gitChanges 
					target.gitChanges = gitChanges
					const itemDirectory = normalizeDir(target.getAttribute("fullpath"),true)
					const explorerState = explorerContainer && explorerContainer.state || itemState
					this.explorerContainer = explorerContainer || this
					const fileExtension = isItemFolder?null:getFormat(target.getAttribute("fullpath"))
					const itemIcon = target.getElementsByClassName('icon')[0]
					const itemArrow = target.getElementsByClassName('arrow')[0]
					const gitStatus = target.getAttribute("git-status") ||true
					const itemProjectDirectory = target.getAttribute("parentfolder")
					target.style.paddingLeft = `${Number(target.getAttribute("level"))+6}px`
					if(isItemFolder){
						setStateClosed(target) //If it's a folder set it's icon to closed by default
					}else{
						setFileIcon(itemIcon,fileExtension)//If it's a file set it's icon 
						itemArrow.style.opacity = 0 //Hide the folder icon
					}
					const gitResult = getMyStatus(
						itemDirectory,
						gitChanges,
						itemProjectDirectory
					)
					markStatus(target,gitResult.status)
					RunningConfig.on('gitStatusUpdated',({ gitChanges, parentFolder:explorerParentfolder })=>{
						console
						if(itemProjectDirectory == explorerParentfolder && this.children[0]){
							target.gitChanges = gitChanges
							const newGitResult = getMyStatus(
								itemDirectory,
								gitChanges,
								itemProjectDirectory
							)
							if( gitResult != newGitResult ) markStatus(this,newGitResult.status)
						}
					})
					explorerState.on('newFile',({containerFolder,fileName})=>{
						if( isItemFolder  && containerFolder == itemDirectory  ){
							explorerState.emit('createItem',{
								container:this,
								containerFolder,
								level:this.getAttribute("level"),
								directory:path.join(containerFolder,fileName),
								directoryName:fileName,
								isFolder:false
							})
						}
					})
					explorerState.on('removedFile',({filePath})=>{
						if( itemDirectory == filePath ){
							this.remove()
							RunningConfig.emit('aFileHasBeenRemoved',{
								parentFolder,
								filePath
							})
						}
						
					})
					explorerState.on('newFolder',({containerFolder,folderName})=>{
						if( isItemFolder && containerFolder == itemDirectory  ){
							explorerState.emit('createItem',{
								container:this,
								containerFolder,
								level:this.getAttribute("level"),
								directory:path.join(containerFolder,folderName),
								directoryName:folderName,
								isFolder:true
							})
						}
					})
					explorerState.on('removedFolder',({folderPath})=>{
						if( itemDirectory == folderPath ){
							this.remove()
						}
						RunningConfig.emit('aFolderHasBeenRemoved',{
							folderPath,
							parentFolder
						})
					})
					explorerState.on('changedFile',async ({filePath})=>{
						if( itemDirectory == filePath ){
							RunningConfig.emit('aFileHasBeenChanged',{
								filePath,
								newData:await fs.readFile(itemDirectory,'UTF-8')
							})
						}
					})
					itemState.on('clickItem',function(){
						if(target.getAttribute("isDirectory") == "true"){
							const itemsContainer = target.children[1]
							if(itemsContainer == null){
								new Explorer(target.getAttribute("fullpath"),target,Number(target.getAttribute("level"))+1,gitChanges)
								setStateOpen(target)
							}else{
								itemsContainer.remove()
								setStateClosed(target)
							}
						}else{
							const basename = path.basename(target.getAttribute("fullpath"))
							const fileExtension = getFormat(target.getAttribute("fullpath"))
							const { bodyElement, tabElement, tabState, isCancelled } = new Tab({
								title:basename,
								directory:target.getAttribute("fullpath"),
								parentFolder:target.getAttribute("parentFolder")
							})
							if( isCancelled ) return; //Cancels the tab opening
							fs.readFile(target.getAttribute("fullpath"),'UTF-8').then(function(data){
								new Editor({
									language:fileExtension,
									value:data ,
									theme:ExtensionsRegistry.registry.data.list[StaticConfig.data.appTheme].textTheme,
									bodyElement,
									tabElement,
									tabState,
									directory:itemDirectory
								})
							})
							tabState.on('focusedMe',()=>{
								target.setAttribute("selected",true)
							})
							tabState.on(['unfocusedMe','destroyed'],()=>{
								target.setAttribute("selected",false)
							})
							target.setAttribute("selected",true)	
						}
					})
					itemState.on('doReload',function(){
						reload(target,gitChanges)
					})
				}
			}
		})
		return ItemComp
}

function reload(target,gitChanges){
	if(target.children[1] != null) target.children[1].remove()
	new Explorer(target.getAttribute("fullpath"),target,Number(target.getAttribute("level"))+1,gitChanges)
	setStateOpen(target)
}

function setFileIcon(target,extension){
	const fileName = target.parentElement.textContent
	if(extension == ("png" || "jpg" || "ico")){
		target.src = Icons.image
		return;
	}
	if(Icons[`file.${fileName}`] ){
		target.src = Icons[`file.${fileName}`] 
		return
	}
	if(Icons[`${extension}.lang`] ){
		target.src = Icons[`${extension}.lang`] 
	}else{
		target.src = Icons['unknown.file'] 
	}     
}

function setStateOpen(target){
	const itemIcon = target.getElementsByClassName('icon')[0]
	const folderName = target.textContent
	target.setAttribute('opened','true')
	if( Icons[`folder.opened.${folderName}`]  ) {
		itemIcon.src = Icons[`folder.opened.${folderName}`]
	}else{
		itemIcon.src = Icons["folder.opened"]
	}
}

function setStateClosed(target){
	const itemIcon = target.getElementsByClassName('icon')[0]
	const folderName = target.textContent
	target.setAttribute('opened','false')
	if( Icons[`folder.closed.${folderName}`] ) {
		itemIcon.src = Icons[`folder.closed.${folderName}`]
	}else{
		itemIcon.src = Icons["folder.closed"]
	}
}

function removeDirectoryOrFile(element){
	areYouSureDialog().then(function(){
		trash([element.parentElement.getAttribute("fullpath")]).then(function(){
			element && element.remove()
		});        
	}).catch(function(err){
		//Clicked "No", do nothing
	})
}

export default Item