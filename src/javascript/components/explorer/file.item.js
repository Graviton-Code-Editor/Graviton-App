import { puffin, element, style } from '@mkenzo_8/puffin'
import FilesExplorer from '../../constructors/files.explorer'
import ContextMenu from '../../constructors/contextmenu'
import Tab from '../../constructors/tab'
import Editor from '../../constructors/editor'
import newDirectoryDialog from '../../defaults/dialogs/new.directory'
import areYouSureDialog from '../../defaults/dialogs/you.sure'
import StaticConfig from 'StaticConfig'
import PluginsRegistry from 'PluginsRegistry'
import RunningConfig from 'RunningConfig'
import Icons from '../../../../assets/icons/**.svg'
import ArrowIcon from '../icons/arrow'
import parseDirectory from '../../utils/directory.parser'
import getFormat from '../../utils/format.parser'
import normalizeDir from  '../../utils/directory.normalizer'

const fs = window.require('fs-extra')
const trash = window.require('trash')
const path = window.require('path')

function getMyStatus( fileDir, gitChanges, projectDir ){
	const filePath = normalizeDir( fileDir )
	const projectPath = normalizeDir( projectDir )
	const supportedGitStatuses = ['not_added','modified']
	let result = {
		status:'unknown'
	}
	if( gitChanges ){
		if( filePath === projectPath ){
			if( gitChanges.modified.length > 0 ){
				return result = {
					status:'modified'
				}
			}
			if( gitChanges.not_added.length > 0 ){
				return result = {
					status:'not_added'
				}
			}	
		}
		supportedGitStatuses.map( status =>{
			gitChanges[status].filter( gitPath =>{
				if( normalizeDir( path.resolve( projectPath, gitPath ) ) == normalizeDir( filePath ) ){
					return result = {
						status:status
					}
				}else{
					const dirsGit =  normalizeDir( gitPath ).split( path.sep ).filter(Boolean)
					const dirsLocal = normalizeDir( filePath ).split( path.sep ).filter(Boolean)
					dirsGit.filter( dirGit =>{
						const dirLocal = dirsLocal[dirsLocal.length-1]
						if( dirLocal === dirGit ){
							if( normalizeDir( path.resolve( projectPath, gitPath ) ).indexOf( normalizeDir(filePath) ) > -1){
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

function markStatus( target, status, count ){
	const spanText = target.children[0].children[2]
	const statusIndicator = target.children[0].children[3]
	const isDirectory = target.getAttribute('isFolder') === 'true'
	switch( status ){
		case 'modified':
			target.setAttribute('gitStatus','modified')
			if( isDirectory ) {
				count && statusIndicator.setAttribute('count', count)
			}else{
				spanText.textContent = `${spanText.getAttribute('originalName')} - M`
			}
			break;
		case 'not_added': //Same as untracked
			target.setAttribute('gitStatus','not_added')
			if( isDirectory ) {
				count && statusIndicator.setAttribute('count', count)
			}else{
				spanText.textContent = `${spanText.getAttribute('originalName')} - U`
			}
			break;
		default:
			target.setAttribute('gitStatus', null)
			target.getAttribute('fullpath')
			if( isDirectory) {
				statusIndicator.setAttribute('count','')
			}else{
				spanText.textContent = spanText.getAttribute('originalName')
			}
	}
}
const ItemWrapper = style`
	&[animated="true"]{
		animation: appearItem 0.1s ease-out;
	}
	&{
		background:transparent;
		white-space:nowrap;
		padding:0px;
		user-select:none;
		margin-top:1px;
		margin-left: 10px;
	}
	&[animated="true"] > button:active{
		transition: 0.1s;
		transform: scale(0.97);
	}
	&[animated="true"] button{
		transition:0.07s;
	}
	& > button{
		margin:0;
		border-radius:12px;
		font-size:12px;
		padding:3px 5px;
		padding-right:9px;
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
		border-radius:50px;
		margin: auto 2px;
		margin-left:6px;
		font-size:9px;
		min-width:10px;
		padding:1px 3px;
	}
	& .gitStatus[count=""]{
		min-width:0px;
		padding:3px;
	}
	&[gitStatus="modified"] > button > span {
		color:var(--explorerItemGitModifiedText);
	}
	&[gitStatus="not_added"] > button > span {
		color:var(--explorerItemGitNotAddedText);
	}
	&[gitStatus="modified"][isFolder="true"] > button > .gitStatus {
		display:block;
		background:var(--explorerItemGitModifiedIndicator);
	}
	&[gitStatus="not_added"][isFolder="true"] > button > .gitStatus {
		display:block;
		background:var(--explorerItemGitNotAddedIndicator);
	}
	&[isFolder="true"] > button > .gitStatus::after{	
		content: attr(count) ;
		color:var(--explorerItemGitIndicatorText);
	}
	& .icon{
		height:20px;
		width:20px;
		margin-right:4px;
		position:relative;
	}
	&[animated="true"]{
		transition:0.1s;
	}
	& .arrow{
		height:8px;
		width:8px;
		position:relative;
		padding:0px;
		margin-right:3px;
		border-radius:1px;
	}
	&[opened="true"] .arrow{
		transform:rotate(90deg);
	}
	&[opened="false"] .arrow{
		transform:rotate(0deg);
	}
`
function Item({
	parentFolder, //Directory parent
	explorerContainer,
	id,
	isFolder,
	level,
	dirName,
	fullpath,
	classSelector,
	gitChanges,
	hint
}){
	return element({
		components:{
			ArrowIcon
		}
	})`
		<div level="${level}" id="${parentFolder}" fullpath="${fullpath}" isFolder="${isFolder}" parentFolder="${parentFolder}" mounted="${mounted}" selected="false" opened="false" class="${ItemWrapper} ${()=>classSelector}" animated="${StaticConfig.data.appEnableExplorerItemsAnimations}">
			<button :click="${openDirectory}" :contextmenu="${contextMenu}" title="${hint}">
				<ArrowIcon class="arrow" style="${isFolder ? '':'opacity:0;'}"></ArrowIcon>
				<img class="icon" src="${ isFolder ? getFolderClosedIcon(dirName) : getFileIcon(dirName,getFormat(fullpath))}"></img>
				<span originalName="${dirName}">${dirName}</span>
				<div class="gitStatus" count=""/>
			</button>
		</div>
		`
	function openDirectory(){
		this.parentElement.state.emit('clickItem')
	}
	function contextMenu( e ){
		const projectExplorerState = document.getElementById( parentFolder ).state
		if( isFolder ){
			new ContextMenu({
				list:[
					{
						label: 'New folder',
						action: () => {
							const itemContainer = this.parentElement
							newDirectoryDialog({
								isFolder: true,
								parentDirectory: fullpath,
								container: itemContainer,
								explorerState: projectExplorerState
							})
						}
					},
					{
						label: 'New file',
						action: () => {
							const itemContainer = this.parentElement
							newDirectoryDialog({
								isFolder: false,
								parentDirectory: fullpath,
								container: itemContainer,
								explorerState: projectExplorerState
							})
						}
					},
					{},
					{
						label: 'Remove folder',
						action: () => {
							if( level != 0 ){
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
						label: 'Remove file',
						action: () => {
							removeDirectoryOrFile(this)
						}
					}
				],
				parent: this,
				event: e
			})
		}
	}
	function setItemState( target ){
		if ( !target.state ) {
			const itemState = new puffin.state({})
			return target.state = itemState
		}else{
			return target.state
		}
	}
	function mounted(){
		const target = this
		target.gitChanges = gitChanges
		this.explorerContainer = explorerContainer && explorerContainer.explorerContainer || this
		const itemState = setItemState( target )
		const itemDirectory = normalizeDir( fullpath )
		const explorerState = this.explorerContainer.state || itemState
		const fileExtension = isFolder? null : getFormat(fullpath)
		const itemIcon = target.getElementsByClassName('icon')[0]
		const itemArrow = target.getElementsByClassName('arrow')[0]
		const gitStatus = target.getAttribute('git-status') || true
		const itemParentFolder = path.dirname(itemDirectory)
		const itemProjectDirectory = parentFolder
		const gitResult = getMyStatus(
			itemDirectory,
			gitChanges,
			itemProjectDirectory
		)
		markStatus( target, gitResult.status)
		function markItem( gitChanges, isProjectcontainer = false ){
			target.gitChanges = gitChanges
			const newGitResult = getMyStatus(
				itemDirectory,
				gitChanges,
				itemProjectDirectory
			)
			if( gitResult !== newGitResult ){
				markStatus(
					target,
					newGitResult.status,
					isProjectcontainer ? gitChanges.files.length : null
				)
			}
		}
		explorerState.on('gitMarkProjectContainer',({ containerFolder, gitChanges }) => {
			if( isFolder  && containerFolder === itemDirectory  ){
				markItem(gitChanges,true)
			}
		})
		explorerState.on('newFile',({ containerFolder, fileName }) => {
			if( isFolder  && containerFolder === itemDirectory  ){
				explorerState.emit('createItem',{
					container: this,
					containerFolder,
					level,
					directory: path.join( containerFolder, fileName ),
					directoryName: fileName,
					isFolder: false
				})
			}
		})
		explorerState.on('removedFile',({ filePath }) => {
			if( itemDirectory === filePath ){
				this.state.emit('destroyed')
				RunningConfig.emit('aFileHasBeenRemoved',{
					parentFolder,
					filePath
				})
			}
		})
		explorerState.on('newFolder',({ containerFolder, folderName }) => {
			if( isFolder && containerFolder === itemDirectory  ){
				explorerState.emit('createItem',{
					container: this,
					containerFolder,
					level,
					directory: path.join(containerFolder,folderName),
					directoryName: folderName,
					isFolder: true
				})
			}
		})
		explorerState.on('removedFolder',({ folderPath }) => {
			if( itemDirectory === folderPath ){
				this.remove()
				RunningConfig.emit('aFolderHasBeenRemoved',{
					folderPath,
					parentFolder
				})
			}
		})
		explorerState.on('changedFile',async ({ filePath }) => {
			if( itemDirectory === filePath ){
				RunningConfig.emit('aFileHasBeenChanged',{
					filePath,
					newData: await fs.readFile(itemDirectory,'UTF-8')
				})
			}
		})
		itemState.on('clickItem',function(){
			if( isFolder ){
				const itemsContainer = target.children[1]
				if( itemsContainer == null ){
					FilesExplorer(
						fullpath,
						target,
						level + 1 , 
						gitChanges 
					)
					setStateOpen( target )
				}else{
					itemsContainer.remove()
					setStateClosed( target )
				}
			}else{
				const itemPath = fullpath
				const basename = path.basename( itemPath )
				const fileExtension = getFormat( itemPath )
				const { bodyElement, tabElement, tabState, isCancelled } = new Tab({
					title: basename,
					directory: itemDirectory,
					parentFolder: target.getAttribute('parentFolder')
				})
				if( !isCancelled ){
					fs.readFile( itemDirectory ,'UTF-8').then( data => {
						new Editor({
							language: fileExtension,
							value: data ,
							theme: PluginsRegistry.registry.data.list[StaticConfig.data.appTheme].textTheme,
							bodyElement,
							tabElement,
							tabState,
							directory: itemDirectory
						})
					})
					target.setAttribute('selected', true)
					tabState.on('focusedItem',()=> target.scrollIntoView() )
				}
			}
		})
		const itemTabs = document.getElementsByClassName(`tab${itemDirectory}`)
		if( itemTabs[0] && itemTabs[0].state.data.active ) target.setAttribute('selected', true )
		const TabFocusedWatcher = RunningConfig.on('aTabHasBeenFocused',({ directory }) => {
			if( directory === itemDirectory ){
				target.setAttribute('selected', true)
			}
		})
		const TabUnfocusedWatcher = RunningConfig.on('aTabHasBeenUnfocused',({ directory }) => {
			if( directory === itemDirectory ){
				target.setAttribute('selected', false)
			}
		})
		const TabClosedWatcher = RunningConfig.on('aTabHasBeenClosed',({ directory }) => {
			if( directory === itemDirectory ){
				target.setAttribute('selected', false)
			}
		})
		const GitWatcher = RunningConfig.on('gitStatusUpdated',({ gitChanges, parentFolder: explorerParentfolder })=>{
			if( itemProjectDirectory === explorerParentfolder && this.children[0] ){
				markItem(gitChanges,itemDirectory==itemProjectDirectory)
			}
		})
		itemState.on('doReload',() => reload(target,gitChanges) )
		itemState.on('destroyed',() => {
			TabFocusedWatcher.cancel()
			TabUnfocusedWatcher.cancel()
			TabClosedWatcher.cancel()
			GitWatcher.cancel()
			this.remove()
		})
		if( level == 0) {
			itemState.emit('clickItem')
		}
	}

}

function reload( target, gitChanges ){
	if( target.children[1] ) target.children[1].remove()
	FilesExplorer(
		target.getAttribute('fullpath'),
		target,
		Number( target.getAttribute('level') ) + 1 ,
		gitChanges
	)
	setStateOpen( target )
}

function getFileIcon( fileName, fileExt ){
	if( fileExt === ('png' || 'jpg' || 'ico') ){
		return Icons.image
	}
	if( Icons[`file.${fileName}`] ){
		return Icons[`file.${fileName}`] 
	}
	if( Icons[`${fileExt}.lang`] ){
		return Icons[`${fileExt}.lang`] 
	}else{
		return Icons['unknown.file'] 
	}     
}

function getFolderClosedIcon( folderName ){
	if( Icons[`folder.closed.${folderName}`] ) {
		return Icons[`folder.closed.${folderName}`]
	}else{
		return Icons['folder.closed']
	}
}

function setStateOpen( target ){
	const itemIcon = target.getElementsByClassName('icon')[0]
	const folderName = target.textContent.trim()
	target.setAttribute('opened','true')
	if( Icons[`folder.opened.${folderName}`]  ) {
		itemIcon.src = Icons[`folder.opened.${folderName}`]
	}else{
		itemIcon.src = Icons['folder.opened']
	}
}

function setStateClosed( target ){
	const itemIcon = target.getElementsByClassName('icon')[0]
	const folderName = target.textContent.trim()
	target.setAttribute('opened','false')
	if( Icons[`folder.closed.${folderName}`] ) {
		itemIcon.src = Icons[`folder.closed.${folderName}`]
	}else{
		itemIcon.src = Icons['folder.closed']
	}
}

function removeDirectoryOrFile( element ){
	areYouSureDialog().then( () => {
		trash([normalizeDir(element.parentElement.getAttribute('fullpath'))]).then( () => {
			element.parentElement && element.parentElement.state && element.parentElement.state.emit('destroyed')
		});        
	}).catch( err => {
		//Clicked "No", do nothing
	})
}

export default Item