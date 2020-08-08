import { state, element } from '@mkenzo_8/puffin'
import FilesExplorer from '../../constructors/files.explorer'
import ContextMenu from '../../constructors/contextmenu'
import Tab from '../../constructors/tab'
import Editor from '../../constructors/editor'
import newDirectoryDialog from '../../defaults/dialogs/new.directory'
import WarningDialog from '../../utils/dialogs/warning'
import InputDialog from '../../utils/dialogs/dialog.input'
import StaticConfig from 'StaticConfig'
import PluginsRegistry from 'PluginsRegistry'
import RunningConfig from 'RunningConfig'
import ArrowIcon from '../icons/arrow'
import parseDirectory from '../../utils/directory.parser'
import getFormat from '../../utils/format.parser'
import normalizeDir from '../../utils/directory.normalizer'
import Notification from '../../constructors/notification'
import FileItem from './file.item.style'
import copy from 'copy-to-clipboard'
import fs from 'fs-extra'
import path from 'path'
const trash = window.require('trash')

import PuffinElement from '../../types/puffin.element'
import PuffinState from '../../types/puffin.state'

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

	private isFolder: boolean

	private projectPath: any
	private projectGitData: any

	private explorerContainer: any
	private explorerState: any

	/**
	 *
	 * Create a explorer item
	 *
	 * @param projectPath {string} - Project's folder path.
	 * @param explorerContainer {HTMLElement} - Element container of the item.
	 * @param isFolder {boolean} - If the item is a folder or not.
	 * @param level {string} - Level of the item, counting from the project folder.
	 * @param fullpath {string} - Item's path.
	 * @param classSelector {string} - Unique class selector for the item.
	 * @param gitChanges {object} - Current git changes.
	 * @param hint {string} - Item's text on hovering.
	 *
	 */
	constructor({ projectPath, explorerContainer, isFolder, level, fullPath, classSelector, gitChanges, hint }) {
		const self = this

		this.isFolder = isFolder
		this.itemPath = normalizeDir(fullPath)
		this.itemName = path.basename(fullPath)
		this.itemFolder = normalizeDir(path.dirname(path.normalize(this.itemPath)))
		this.itemLevel = level
		this.itemExtension = this.isFolder ? null : getFormat(this.itemPath)
		this.itemClass = classSelector

		this.projectPath = projectPath

		const clickListener = this._clickListener.bind(this)
		const contextListener = this._contextListener.bind(this)
		const draggingListener = this._draggingListener.bind(this)
		const dragginInListener = this._draggingInListener.bind(this)
		const dragDroppedListener = this._dragDroppedListener.bind(this)

		return element({
			components: {
				FileItem,
				ArrowIcon,
			},
		})`
			<FileItem class="${classSelector} level="${level}" id="${
			level === 0 ? projectPath : ''
		}" fullpath="${fullPath}" itemClass="${classSelector}" isFolder="${isFolder}" parentFolder="${projectPath}" mounted="${mounted}" selected="false" opened="false" animated="${
			StaticConfig.data.appEnableExplorerItemsAnimations
		}" :drop="${dragDroppedListener}" >
				<button draggable="true" itemClass="${classSelector}" :dragover="${dragginInListener}" :dragstart="${draggingListener}"  :click="${clickListener}" :contextmenu="${contextListener}" title="${hint}">
					<ArrowIcon draggable="false" itemClass="${classSelector}"  class="arrow" style="${isFolder ? '' : 'opacity:0;'}"></ArrowIcon>
					<img draggable="false" itemClass="${classSelector}" class="icon" src="${this._getIconSource()}"></img>
					<span itemClass="${classSelector}" originalName="${this.itemName}">${this.itemName}</span>
					<div itemClass="${classSelector}" class="gitStatus" count=""/>
				</button>
			</FileItem>
		`
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
	public _draggingListener(ev): void {
		ev.stopPropagation()
		ev.dataTransfer.setData('class', this.itemClass)
	}
	public _draggingStarted(ev): void {
		ev.stopPropagation()
		ev.dataTransfer.setData('class', this.itemClass)
	}
	public _draggingInListener(ev): void {
		ev.stopPropagation()
		ev.preventDefault()
	}
	public _dragDroppedListener(ev): void {
		ev.stopImmediatePropagation()
		ev.preventDefault()
		const destinationItem: any = document.getElementsByClassName((ev.target as any).getAttribute('itemClass'))[0]
		const incomingItemClass = ev.dataTransfer.getData('class')
		const incomingItem: any = document.getElementsByClassName(incomingItemClass)[0]
		const oldItemPath = incomingItem.instance.itemPath
		const newItemPath = normalizeDir(path.join(destinationItem.instance.itemPath, incomingItem.instance.itemName))
		const newItemDirectory = normalizeDir(path.dirname(path.join(destinationItem.instance.itemPath, incomingItem.instance.itemName)))

		if (oldItemPath === newItemPath || newItemDirectory === oldItemPath) return

		fs.rename(oldItemPath, newItemPath)
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
				new FilesExplorer(this.itemPath, this.projectPath, this.itemElement, this.itemLevel + 1, false, this.projectGitData)
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
			})
			if (!isCancelled) {
				fs.readFile(this.itemPath, 'UTF-8').then(data => {
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
				tabState.on('focusedItem', () => this.itemElement.scrollIntoView())
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
			new ContextMenu({
				list: [
					{
						label: 'misc.NewFolder',
						action: () => {
							newDirectoryDialog({
								isFolder: true,
								parentDirectory: this.itemPath,
								container: this.itemElement,
								explorerState: this.explorerState,
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
							copy(this.itemPath)
						},
					},
					{
						label: 'misc.OpenLocation',
						action: () => {
							openLocation(this.itemPath)
						},
					},
				],
				parent: this.itemElement,
				event,
			})
		} else {
			new ContextMenu({
				list: [
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
							copy(this.itemPath)
						},
					},
					{
						label: 'misc.OpenLocation',
						action: () => {
							openLocation(this.itemPath)
						},
					},
				],
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
				fs.rename(this.itemPath, newPath)
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
					.catch(err => console.log(err))
			})
			.catch(err => {
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
				trash([normalizeDir(directoryPath)])
					.then(() => {
						this.itemState.emit('destroyed')
						RunningConfig.emit('aFileHasBeenRemoved', {
							parentFolder: this.projectPath,
							filePath: this.itemPath,
						})
					})
					.catch(err => {
						new Notification({
							title: `Error`,
							content: `Couldn't remove ${path.basename(directoryPath)}.`,
						})
					})
			})
			.catch(err => {
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
		new FilesExplorer(this.itemPath, this.projectPath, this.itemElement, this.itemLevel + 1, false, this.projectGitData)
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
	private _setGitChanges(data, status) {
		this.itemGitStatus = status
		this.itemElement.gitChanges = data
		this.projectGitData = data
	}
	/**
	 *
	 * Set the new git status to the item's DOM element.
	 *
	 */
	private _markStatus(status, count?) {
		const spanText = this.itemElement.children[0].children[2]
		const statusIndicator = this.itemElement.children[0].children[3]
		const isDirectory = this.isFolder
		switch (status) {
			case 'modified':
				this.itemElement.setAttribute('gitStatus', 'modified')
				if (isDirectory) {
					count && statusIndicator.setAttribute('count', count)
				} else {
					spanText.textContent = `${spanText.getAttribute('originalName')} - M`
				}
				break
			case 'not_added': //Same as untracked
				this.itemElement.setAttribute('gitStatus', 'not_added')
				if (isDirectory) {
					count && statusIndicator.setAttribute('count', count)
				} else {
					spanText.textContent = `${spanText.getAttribute('originalName')} - U`
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
	private _getGitStatus(gitChanges) {
		const filePath = this.itemPath
		const projectPath = this.projectPath
		const supportedGitStatuses = ['not_added', 'modified']

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
				gitChanges[status].filter(gitPath => {
					if (normalizeDir(path.resolve(projectPath, gitPath)) == normalizeDir(filePath)) {
						return (result = status)
					} else {
						const dirsGit = normalizeDir(gitPath).split(path.sep).filter(Boolean)
						const dirsLocal = normalizeDir(filePath).split(path.sep).filter(Boolean)
						dirsGit.filter(dirGit => {
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
				RunningConfig.emit('aFolderHasBeenremoved', {
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
					newData: await fs.readFile(this.itemPath, 'UTF-8'),
				})
			}
		})
		const itemTabs = document.getElementsByClassName(`tab${this.itemPath}`)
		if (<PuffinElement>itemTabs[0] && (<PuffinElement>itemTabs[0]).state.data.active) this.itemElement.setAttribute('selected', true)
		const TabFocusedListener = RunningConfig.on('aTabHasBeenFocused', ({ directory }) => {
			if (directory === this.itemPath) {
				this.itemElement.setAttribute('selected', true)
			}
		})
		const TabUnfocusedListener = RunningConfig.on('aTabHasBeenUnfocused', ({ directory }) => {
			if (directory === this.itemPath) {
				this.itemElement.setAttribute('selected', false)
			}
		})
		const TabClosedListener = RunningConfig.on('aTabHasBeenClosed', ({ directory }) => {
			if (directory === this.itemPath) {
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
		let removedProjectFolderListener
		if (this.itemLevel == 0) {
			removedProjectFolderListener = RunningConfig.on('removeFolderFromRunningWorkspace', ({ folderPath }) => {
				if (folderPath == this.itemPath) {
					this.explorerState.emit('closedFolder', this.itemPath)
					this.itemState.emit('destroyed')
				}
			})
		}
		const reloadItemListener = this.itemState.on('forceOpen', () => this._forceOpen())
		const closedFolderListener = this.explorerState.on('closedFolder', folderPath => {
			if (this.itemPath.includes(folderPath) && this.itemPath !== folderPath) {
				this.itemState.emit('destroyed')
			}
		})
		this.itemState.on('destroyed', () => {
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
			this.itemElement.remove()
		})
	}
}

function getFileIcon(fileName, fileExt) {
	if (fileExt === ('png' || 'jpg' || 'ico')) {
		return RunningConfig.data.iconpack.image || RunningConfig.data.iconpack['unknown.file']
	}
	if (RunningConfig.data.iconpack[`file.${fileName}`]) {
		return RunningConfig.data.iconpack[`file.${fileName}`]
	}
	if (RunningConfig.data.iconpack[`${fileExt}.lang`]) {
		return RunningConfig.data.iconpack[`${fileExt}.lang`]
	} else {
		return RunningConfig.data.iconpack['unknown.file']
	}
}

function getFolderClosedIcon(folderName) {
	if (RunningConfig.data.iconpack[`folder.closed.${folderName}`]) {
		return RunningConfig.data.iconpack[`folder.closed.${folderName}`]
	} else {
		return RunningConfig.data.iconpack['folder.closed']
	}
}

function openLocation(location) {
	const { shell } = window.require('electron')
	shell.openItem(location)
}

export default Item
