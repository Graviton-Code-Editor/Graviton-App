import { state, element } from '@mkenzo_8/puffin'
import FilesExplorer from '../../constructors/files.explorer'
import ContextMenu from '../../constructors/contextmenu'
import Tab from '../../constructors/tab'
import Editor from '../../constructors/editor'
import newDirectoryDialog from '../../defaults/dialogs/new_directory'
import WarningDialog from '../../utils/dialogs/warning'
import InputDialog from '../../utils/dialogs/dialog_input'
import StaticConfig from 'StaticConfig'
import PluginsRegistry from 'PluginsRegistry'
import RunningConfig from 'RunningConfig'
import ArrowIcon from '../icons/arrow'
import parseDirectory from '../../utils/directory_parser'
import getFormat from '../../utils/format_parser'
import normalizeDir from '../../utils/directory_normalizer'
import Notification from '../../constructors/notification'
import FileItem from './file.item.style'
import Core from 'Core'
const { clipboard } = Core
import * as path from 'path'
import PuffinElement from '../../types/puffin.element'
import { PuffinState } from '../../types/puffin.state'
import { getFileIcon } from '../../utils/get_file_icon'

class Item {
	private itemClass: string
	public itemPath: string
	private itemName: string
	private itemElement: any
	private itemLevel: number
	public itemFolder: string
	private itemState: PuffinState
	private itemIconElement: HTMLImageElement
	private itemArrowElement: HTMLImageElement
	private itemGitStatus: string
	private itemExtension: string
	private itemDecorator: any
	private itemIsHidden: boolean

	private isFolder: boolean

	private projectPath: any
	private projectGitData: any

	private explorerContainer: any
	private explorerProvider: any
	private explorerState: any

	constructor({ decorator, explorerProvider, projectPath, explorerContainer, isFolder, isHidden, level, fullPath, classSelector, gitChanges, hint }) {
		const self = this
		this.isFolder = isFolder
		this.itemPath = normalizeDir(fullPath)
		this.itemName = path.basename(fullPath)
		if (this.itemName === '') this.itemName = fullPath
		this.itemFolder = normalizeDir(path.dirname(path.normalize(this.itemPath)))
		this.itemLevel = level
		this.itemExtension = this.isFolder ? null : getFormat(this.itemPath)
		this.itemClass = classSelector
		this.explorerProvider = explorerProvider
		this.projectPath = projectPath
		this.itemDecorator = decorator
		this.itemIsHidden = isHidden || false

		const clickListener = this._clickListener.bind(this)
		const contextListener = this._contextListener.bind(this)
		const dragDroppedListener = this._dragDroppedListener.bind(this)

		const animateItem = StaticConfig.data.appEnableExplorerItemsAnimations
		const IDItem = level === 0 ? projectPath : ''

		return element({
			components: {
				FileItem,
				ArrowIcon,
			},
		})`
			<FileItem class="${classSelector} level="${level}" id="${IDItem}" fullpath="${fullPath}" itemClass="${classSelector}" isFolder="${isFolder}" parentFolder="${projectPath}" mounted="${mounted}" selected="false" opened="false" animated="${animateItem}" :drop="${dragDroppedListener}" >
				<button ishidden="${
					this.itemIsHidden
				}" draggable="true" :dragleave="${dragLeave}" :dragenter="${dragEnter}" :drop="${onDropped}" :dragstart="${startDrag}" :dragover="${draggingOver}" itemClass="${classSelector}" :click="${clickListener}" :contextmenu="${contextListener}" title="${hint}">
					<ArrowIcon draggable="false" itemClass="${classSelector}"  class="arrow" style="${isFolder ? '' : 'opacity:0;'}"/>
					<img draggable="false" itemClass="${classSelector}" class="icon" src="${this._getIconSource()}"/>
					<span itemClass="${classSelector}" originalName="${this.itemName}">${this.itemName}</span>
					<div itemClass="${classSelector}" class="decorator gitStatus" count=""/>
					<div itemClass="${classSelector}" class="decorator">${handleTextDecorator}</div>
				</button>
			</FileItem>
		`

		function onDropped(e: DragEvent): void {
			e.preventDefault()
			self.itemElement.classList.remove('dragging')
		}

		function dragEnter(e: DragEvent): void {
			e.preventDefault()
			self.itemElement.classList.add('dragging')
		}

		function dragLeave(e: DragEvent): void {
			self.itemElement.classList.remove('dragging')
		}

		function draggingOver(e: DragEvent): void {
			e.preventDefault()
		}

		function startDrag(e: DragEvent): void {
			e.stopPropagation()
			e.dataTransfer.setData('type', 'explorerItem')
			e.dataTransfer.setData('filePath', self.itemPath)
			e.dataTransfer.setData('isFolder', self.isFolder.toString())
			e.dataTransfer.setData('class', self.itemClass)
		}

		function handleTextDecorator() {
			if (self.itemDecorator) {
				return element`
					<p>${self.itemDecorator.text}</p>
				`
			}
			return element`<div/>`
		}

		function createItemState(target) {
			if (!target.state) {
				const itemState = new state({})
				target.state = itemState
				return target.state
			} else {
				return target.state
			}
		}
		function mounted() {
			const target = this

			target.instance = self

			self.itemElement = target
			self.explorerContainer = explorerContainer || this
			self.itemState = createItemState(target)
			self.explorerState = self.explorerContainer.state || self.itemState
			self.itemIconElement = target.getElementsByClassName('icon')[0]
			self.itemArrowElement = target.getElementsByClassName('arrow')[0]
			self._addEventsListeners()
			self._setGitChanges(gitChanges, null)
			self._markItem(gitChanges)

			if (self.itemLevel === 0) {
				self.itemState.emit('forceOpen')
			}

			target.state = self.explorerState
		}
	}
	private _getIconSource(): string {
		return this.isFolder ? getFolderClosedIcon(this.itemName) : getFileIcon(this.itemName, getFormat(this.itemPath))
	}
	public _dragDroppedListener(ev: DragEvent): void {
		ev.stopImmediatePropagation()
		ev.preventDefault()
		const destinationItem: any = document.getElementsByClassName((ev.target as any).getAttribute('itemClass'))[0]
		const incomingItemClass = ev.dataTransfer.getData('class')
		const incomingItem: any = document.getElementsByClassName(incomingItemClass)[0]
		const oldItemPath = incomingItem.instance.itemPath
		const newItemPath = normalizeDir(path.join(destinationItem.instance.itemPath, incomingItem.instance.itemName))
		const newItemDirectory = normalizeDir(path.dirname(path.join(destinationItem.instance.itemPath, incomingItem.instance.itemName)))

		if (oldItemPath === newItemPath || newItemDirectory === oldItemPath) return

		this.explorerProvider
			.renameDir(oldItemPath, newItemPath)
			.then(() => {
				incomingItem.instance.itemState.emit('destroyed')
				this.explorerState.emit('createItem', {
					container: destinationItem,
					containerFolder: destinationItem.instance.itemFolder,
					level: destinationItem.instance.itemLevel,
					directory: newItemPath,
					isFolder: incomingItem.instance.isFolder,
				})
			})
			.catch((err: string) => console.error(err))
	}
	/*
	 *
	 * Left click handler.
	 *
	 */
	public _clickListener(): void {
		if (this.isFolder) {
			const itemsContainer = this.itemElement.children[1]
			if (itemsContainer == null) {
				new FilesExplorer(this.itemPath, this.projectPath, this.itemElement, this.itemLevel + 1, false, this.projectGitData, {
					provider: this.explorerProvider,
				})
				this._setOpenedIcon()
			} else {
				itemsContainer.remove()
				this._setClosedIcon()
				this.explorerState.emit('closedFolder', this.itemPath)
			}
		} else {
			const basename = path.basename(this.itemPath)
			const { bodyElement, tabElement, tabState, isCancelled } = new Tab({
				isEditor: true,
				title: basename,
				directory: this.itemPath,
				projectPath: this.projectPath,
				explorerProvider: this.explorerProvider,
			})
			if (!isCancelled) {
				this.explorerProvider.readFile(this.itemPath).then((data: string) => {
					const fileExtension = getFormat(this.itemPath)
					new Editor({
						language: fileExtension,
						value: data,
						theme: PluginsRegistry.registry.data.list[StaticConfig.data.appTheme].textTheme,
						bodyElement,
						tabElement,
						tabState,
						directory: this.itemPath,
					})
				})
				this.itemElement.setAttribute('selected', true)
			}
		}
	}
	/**
	 *
	 * Right click context menu handler.
	 *
	 */
	private _contextListener(event: MouseEvent): void {
		if (this.isFolder) {
			const folderContextMenu = [
				{
					label: 'misc.NewFolder',
					action: () => {
						newDirectoryDialog({
							isFolder: true,
							parentDirectory: this.itemPath,
							container: this.itemElement,
							explorerState: this.explorerState,
							explorerProvider: this.explorerProvider,
						})
					},
				},
				{
					label: 'misc.NewFile',
					action: () => {
						newDirectoryDialog({
							isFolder: false,
							parentDirectory: this.itemPath,
							container: this.itemElement,
							explorerState: this.explorerState,
							explorerProvider: this.explorerProvider,
						})
					},
				},
				{},
				{
					label: 'misc.Rename',
					action: () => {
						this._rename()
					},
				},
				{},
				{
					label: 'misc.Remove',
					action: () => {
						if (this.itemLevel !== 0) {
							this._remove()
						}
					},
				},
				{},
				{
					label: 'misc.CopyPath',
					action: () => {
						clipboard.writeText(this.itemPath)
					},
				},
				{
					label: 'misc.OpenLocation',
					action: () => {
						openLocation(this.itemPath)
					},
				},
			]

			// Remove OpenLocation button in BrowserMode
			if (RunningConfig.data.isBrowser) {
				folderContextMenu.splice(8, 1)
			}

			// Add "Remove from workspace" option when it's the folder of a project (top-folder)
			if (this.itemLevel === 0) {
				folderContextMenu.splice(7, 0, {
					label: 'misc.RemoveFromWorkspace',
					action: () => {
						RunningConfig.emit('removeFolderFromRunningWorkspace', {
							folderPath: this.itemPath,
						})
					},
				})
			}

			new ContextMenu({
				list: folderContextMenu,
				parent: this.itemElement,
				event,
			})
		} else {
			const fileContextMenu = [
				{
					label: 'misc.Rename',
					action: () => {
						this._rename()
					},
				},
				{},
				{
					label: 'misc.Remove',
					action: () => {
						this._remove()
					},
				},
				{},
				{
					label: 'misc.CopyPath',
					action: () => {
						clipboard.writeText(this.itemPath)
					},
				},
				{
					label: 'misc.OpenLocation',
					action: () => {
						openLocation(this.itemFolder)
					},
				},
			]

			// Remove OpenLocation button in BrowserMode
			if (RunningConfig.data.isBrowser) {
				fileContextMenu.splice(5, 1)
			}

			new ContextMenu({
				list: fileContextMenu,
				parent: this.itemElement,
				event,
			})
		}
	}
	/**
	 *
	 * Open a dialog to rename the file / folder.
	 *
	 */
	private _rename(): void {
		InputDialog({
			title: 'Rename',
			placeHolder: path.basename(this.itemName),
		})
			.then(newName => {
				const newPath = normalizeDir(path.join(this.itemFolder, newName))
				this.explorerProvider
					.renameDir(this.itemPath, newPath)
					.then(() => {
						this.itemState.emit('destroyed')
						this.explorerState.emit('createItem', {
							container: this.explorerContainer,
							containerFolder: this.itemFolder,
							level: this.explorerContainer.getAttribute('level'),
							directory: newPath,
							isFolder: this.isFolder,
						})
					})
					.catch((err: string) => console.log(err))
			})
			.catch(() => {
				//Clicked "No", do nothing
			})
	}
	/**
	 *
	 * Open a `warning` dialog to remove the file / folder.
	 *
	 */
	private _remove(): void {
		const directoryPath = this.itemPath
		WarningDialog()
			.then(() => {
				const trash = window.require('trash')
				trash([normalizeDir(directoryPath)])
					.then(() => {
						this.itemState.emit('destroyed')
						RunningConfig.emit('aFileHasBeenRemoved', {
							parentFolder: this.projectPath,
							filePath: this.itemPath,
						})
					})
					.catch(() => {
						new Notification({
							title: `Error`,
							content: `Couldn't remove ${path.basename(directoryPath)}.`,
						})
					})
			})
			.catch(() => {
				//Clicked "No", do nothing
			})
	}
	/**
	 *
	 * Remove the item's container element.
	 *
	 */
	private _removeItemsContainer(): void {
		if (this.itemElement.children[1]) this.itemElement.children[1].remove()
	}
	/**
	 *
	 * Open the folder.
	 *
	 */
	private _forceOpen(): void {
		this._removeItemsContainer()
		new FilesExplorer(this.itemPath, this.projectPath, this.itemElement, this.itemLevel + 1, false, this.projectGitData, {
			provider: this.explorerProvider,
		})
		this._setOpenedIcon()
	}
	/**
	 *
	 * Set the item's image to a opened folder.
	 *
	 */
	private _setOpenedIcon(): void {
		const itemIcon = this.itemIconElement
		const folderName = this.itemName
		this.itemElement.setAttribute('opened', 'true')
		if (RunningConfig.data.iconpack[`folder.opened.${folderName}`]) {
			itemIcon.src = RunningConfig.data.iconpack[`folder.opened.${folderName}`]
		} else {
			itemIcon.src = RunningConfig.data.iconpack['folder.opened']
		}
	}
	/**
	 *
	 * Set the item's image to a closed folder.
	 *
	 */
	private _setClosedIcon(): void {
		const itemIcon = this.itemIconElement
		const folderName = this.itemName
		this.itemElement.setAttribute('opened', 'false')
		if (RunningConfig.data.iconpack[`folder.closed.${folderName}`]) {
			itemIcon.src = RunningConfig.data.iconpack[`folder.closed.${folderName}`]
		} else {
			itemIcon.src = RunningConfig.data.iconpack['folder.closed']
		}
	}
	/**
	 *
	 * Set the new git changes to the DOM element and the class instance.
	 *
	 */
	private _setGitChanges(data: any, status: string) {
		this.itemGitStatus = status
		this.itemElement.gitChanges = data
		this.projectGitData = data
	}
	/**
	 *
	 * Set the new git status to the item's DOM element.
	 *
	 */
	private _markStatus(status: string, count?: number) {
		const spanText = this.itemElement.children[0].children[2]
		const statusIndicator = this.itemElement.children[0].children[3]
		const isDirectory = this.isFolder
		switch (status) {
			case 'modified': // Modified (M)
				this.itemElement.setAttribute('gitStatus', 'modified')
				if (isDirectory) {
					count && statusIndicator.setAttribute('count', count)
				} else {
					spanText.textContent = `${spanText.getAttribute('originalName')} - M`
				}
				break
			case 'not_added': //Same as untracked (??)
				this.itemElement.setAttribute('gitStatus', 'not_added')
				if (isDirectory) {
					count && statusIndicator.setAttribute('count', count)
				} else {
					spanText.textContent = `${spanText.getAttribute('originalName')} - U`
				}
				break
			case 'renamed': // Renamed (R)
				this.itemElement.setAttribute('gitStatus', 'renamed')
				if (isDirectory) {
					count && statusIndicator.setAttribute('count', count)
				} else {
					spanText.textContent = `${spanText.getAttribute('originalName')} - R`
				}
				break
			case 'created': // Created (A) & (AM)
				this.itemElement.setAttribute('gitStatus', 'created')
				if (isDirectory) {
					count && statusIndicator.setAttribute('count', count)
				} else {
					spanText.textContent = `${spanText.getAttribute('originalName')} - A`
				}
				break
			default:
				this.itemElement.setAttribute('gitStatus', null)
				if (isDirectory) {
					statusIndicator.setAttribute('count', '')
				} else {
					spanText.textContent = spanText.getAttribute('originalName')
				}
		}
	}
	/**
	 *
	 * Set item's git status.
	 *
	 */
	private _markItem(gitData: any) {
		const newGitStatus = this._getGitStatus(gitData)
		if (this.itemGitStatus !== newGitStatus || gitData.files !== this.projectGitData.files) {
			this._markStatus(newGitStatus, this.itemLevel === 0 && gitData ? gitData.files.length : null)
			this._setGitChanges(gitData, newGitStatus)
		}
	}
	/**
	 *
	 * Get the current git status for the item's file.
	 *
	 *
	 * @beta
	 */
	private _getGitStatus(gitChanges: any) {
		const filePath = this.itemPath
		const projectPath = this.projectPath
		const supportedGitStatuses = ['not_added', 'modified', 'created', 'renamed']

		let result = 'unknown'
		if (gitChanges) {
			if (filePath === projectPath) {
				if (gitChanges.modified.length > 0) {
					return (result = 'modified')
				}
				if (gitChanges.not_added.length > 0) {
					return (result = 'not_added')
				}
			}
			supportedGitStatuses.map(status => {
				gitChanges[status].filter((gPath: any) => {
					const gitPath = gPath.to || gPath
					if (normalizeDir(path.resolve(projectPath, gitPath)) == normalizeDir(filePath)) {
						return (result = status)
					} else {
						const dirsGit = normalizeDir(gitPath).split(path.sep).filter(Boolean)
						const dirsLocal = normalizeDir(filePath).split(path.sep).filter(Boolean)
						dirsGit.filter((dirGit: string) => {
							const dirLocal = dirsLocal[dirsLocal.length - 1]
							if (dirLocal === dirGit) {
								if (normalizeDir(path.resolve(projectPath, gitPath)).indexOf(normalizeDir(filePath)) > -1) {
									return (result = status)
								}
							} else {
								return
							}
						})
					}
				})
			})
		}
		return result
	}
	/**
	 *
	 * Add item's listeners.
	 *
	 */
	private _addEventsListeners() {
		const GitStatusListener = RunningConfig.on('gitStatusUpdated', ({ gitChanges, parentFolder: explorerParentFolder }) => {
			if (this.projectPath === explorerParentFolder) {
				this._markItem(gitChanges)
			}
		})

		const NewFileListener = this.explorerState.on('newFile', ({ containerFolder, fileName }) => {
			if (this.isFolder && containerFolder === this.itemPath) {
				this.explorerState.emit('createItem', {
					container: this.itemElement,
					containerFolder,
					level: this.itemLevel,
					directory: path.join(containerFolder, fileName),
					directoryName: fileName,
					isFolder: false,
				})
			}
		})
		const RemovedFileListener = this.explorerState.on('removedFile', ({ filePath }) => {
			if (this.itemPath === filePath) {
				this.itemState.emit('destroyed')
				RunningConfig.emit('aFileHasBeenRemoved', {
					parentFolder: this.itemFolder,
					filePath: this.itemPath,
				})
			}
		})
		const NewFolderListener = this.explorerState.on('newFolder', ({ containerFolder, folderName }) => {
			if (this.isFolder && containerFolder === this.itemPath) {
				this.explorerState.emit('createItem', {
					container: this.itemElement,
					containerFolder,
					level: this.itemLevel,
					directory: path.join(containerFolder, folderName),
					isFolder: true,
				})
			}
		})
		const RemovedFolderListener = this.explorerState.on('removedFolder', ({ folderPath }) => {
			if (this.itemPath === folderPath) {
				this.itemState.emit('destroyed')
				RunningConfig.emit('aFolderHasBeenRemoved', {
					parentFolder: this.itemFolder,
					folderPath: this.itemPath,
				})
			}
		})
		const ChangedFileListener = this.explorerState.on('changedFile', async ({ filePath }) => {
			if (this.itemPath === filePath) {
				RunningConfig.emit('aFileHasBeenChanged', {
					filePath,
					parentFolder: this.itemFolder,
					newData: await this.explorerProvider.readFile(this.itemPath),
				})
			}
		})
		const itemTabs = document.getElementsByClassName(`tab${this.itemPath}`)
		if (<PuffinElement>itemTabs[0] && (<PuffinElement>itemTabs[0]).state.data.active) this.itemElement.setAttribute('selected', true)
		const TabFocusedListener = RunningConfig.on('aTabHasBeenFocused', ({ directory, justCreated }) => {
			if (directory === this.itemPath) {
				RunningConfig.data.focusedExplorerItem = this.itemElement
				this.itemElement.setAttribute('selected', true)
				if (!justCreated) {
					this.itemElement.scrollIntoView({ block: 'center' })
				}
			}
		})
		const TabUnfocusedListener = RunningConfig.on('aTabHasBeenUnfocused', ({ directory }) => {
			if (directory === this.itemPath) {
				RunningConfig.data.focusedExplorerItem = null
				this.itemElement.setAttribute('selected', false)
			}
		})
		const TabClosedListener = RunningConfig.on('aTabHasBeenClosed', ({ directory }) => {
			if (directory === this.itemPath) {
				RunningConfig.data.focusedExplorerItem = null
				this.itemElement.setAttribute('selected', false)
			}
		})
		const IconpackListener = RunningConfig.on('updatedIconpack', () => {
			if (this.itemElement.getAttribute('opened') === 'true') {
				this._setOpenedIcon()
			} else {
				this.itemIconElement.src = this._getIconSource()
			}
		})
		let removedProjectFolderListener: any
		if (this.itemLevel == 0) {
			removedProjectFolderListener = RunningConfig.on('removeFolderFromRunningWorkspace', ({ folderPath }) => {
				if (folderPath == this.itemPath) {
					if (RunningConfig.data.workspaceConfig.folders.length === 0) {
						this.explorerContainer.parentElement.setAttribute('hasFiles', 'false')
					}
					this.explorerState.emit('closedFolder', this.itemPath)
					this.itemState.emit('destroyed')
				}
			})
		}
		const reloadItemListener = this.itemState.on('forceOpen', () => this._forceOpen())
		const closedFolderListener = this.explorerState.on('closedFolder', (folderPath: string) => {
			if (this.itemFolder == folderPath && this.itemPath !== folderPath) {
				this.itemState.emit('destroyed')
			}
		})
		this.itemState.once('destroyed', () => {
			removedProjectFolderListener && removedProjectFolderListener.cancel()
			reloadItemListener.cancel()
			TabFocusedListener.cancel()
			TabUnfocusedListener.cancel()
			TabClosedListener.cancel()
			GitStatusListener.cancel()
			NewFileListener.cancel()
			RemovedFileListener.cancel()
			NewFolderListener.cancel()
			RemovedFolderListener.cancel()
			ChangedFileListener.cancel()
			closedFolderListener.cancel()
			IconpackListener.cancel()
			this.itemElement.remove()
		})
	}
}

function getFolderClosedIcon(folderName: string) {
	if (RunningConfig.data.iconpack[`folder.closed.${folderName}`]) {
		return RunningConfig.data.iconpack[`folder.closed.${folderName}`]
	} else {
		return RunningConfig.data.iconpack['folder.closed']
	}
}

function openLocation(location: string) {
	const { shell } = window.require('electron')
	shell.openPath(location)
}

export default Item
