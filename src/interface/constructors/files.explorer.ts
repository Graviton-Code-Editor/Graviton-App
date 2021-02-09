import { element, render, state } from '@mkenzo_8/puffin'
import FileItem from '../components/explorer/file.item'
import parseDirectory from '../utils/directory_parser'
import normalizeDir from '../utils/directory_normalizer'
import beautifyDir from '../utils/directory_beautifier'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import Notification from './notification'
import * as path from 'path'
import getGitIgnoredFiles from '../utils/get_git_ignored_files'

import { filesWatcherExcludedDirs } from 'Constants'

import { StatusResult } from 'simple-git'
import { ExplorerItem } from '../types/explorer'
import { PuffinState } from 'Types/puffin.state'
import PuffinElement from '../types/puffin.element'

class FilesExplorer {
	private itemElement: PuffinElement
	private folderPath: string
	private container: HTMLElement
	private level: number
	private replaceOldExplorer: boolean
	private gitChanges: any
	private classSelector: string
	private explorerState: PuffinState
	private isGitRepo: boolean
	private enableGitWatcher: boolean
	private enableFilesWatcher: boolean
	private gitWatcher: any
	private filesWatcher: any
	private projectPath: string
	private explorerProvider: any
	/*
	 *
	 * Create a FilesExplorer instance
	 *
	 */
	constructor(folderPath: string, projectPath: string, container: HTMLElement, level: number = 0, replaceOldExplorer: boolean = true, gitChanges: StatusResult = null, { provider }) {
		this.folderPath = normalizeDir(folderPath)
		this.container = container
		this.level = level
		this.replaceOldExplorer = replaceOldExplorer
		this.gitChanges = gitChanges
		this.projectPath = projectPath
		this.explorerProvider = provider

		this.enableGitWatcher = false
		this.enableFilesWatcher = false

		this.init()
	}
	/*
	 *
	 * Indicate the sidepanel that there is at least one explorer inside it.
	 *
	 */
	private _markContainerAsExplorer() {
		this.container.setAttribute('hasFiles', 'true')
	}
	/*
	 *
	 * Check if the project folder is a local git repo.
	 *
	 */
	private _isGitRepo() {
		return new (Promise as any)((resolve, reject) => {
			if (!StaticConfig.data.editorGitIntegration) {
				// Forcefully return `false` if the GitIntegration is disabled
				resolve(false)
			}
			this.explorerProvider.isGitRepo(this.folderPath).then((res: boolean) => {
				resolve(res)
			})
		})
	}
	/*
	 *
	 * Get the current git status of the project folder.
	 *
	 */
	private _getGitChanges() {
		return new Promise(resolve => {
			this.explorerProvider.getGitStatus(this.folderPath).status((err, res) => {
				resolve(res)
			})
		})
	}
	/*
	 *
	 * Create git watcher
	 *
	 */
	private createGitWatcher() {
		const gitWatcherPath = normalizeDir(path.join(this.folderPath, '.git', 'index'))
		let gitWatcher: any
		if (this.isGitRepo && StaticConfig.data.editorGitIntegration) {
			gitWatcher = this.explorerProvider.watchDir(gitWatcherPath, {
				persistent: true,
				interval: 400,
				ignoreInitial: true,
			})
			gitWatcher.on('change', async () => {
				this.gitChanges = await this._getGitChanges()
				RunningConfig.emit('gitStatusUpdated', {
					gitChanges: this.gitChanges,
					branch: this.gitChanges.current,
					parentFolder: this.folderPath,
					anyChanges: this.gitChanges.files.length > 0,
				})
			})
		}
		return gitWatcher
	}
	/*
	 *
	 * Create a files watcher for the project.
	 *
	 */
	private async createProjectWatcher() {
		const ignored = new RegExp([...(await getGitIgnoredFiles(this.folderPath)), ...filesWatcherExcludedDirs, ...StaticConfig.data.editorExcludedDirs].map(x => `(${x})`).join('|'), 'g')
		const projectWatcher = this.explorerProvider.watchDir(this.folderPath, {
			ignored,
			persistent: true,
			interval: 250,
			depth: 20,
			ignoreInitial: true,
		})
		projectWatcher
			.on('add', (filePath: string) => {
				this.explorerState.emit('newFile', {
					containerFolder: normalizeDir(path.dirname(filePath)),
					fileName: path.basename(filePath),
				})
			})
			.on('change', async (fileDir: string) => {
				const filePath = normalizeDir(fileDir)
				this.explorerState.emit('changedFile', {
					filePath,
				})
			})
			.on('unlink', (fileDir: string) => {
				const filePath = normalizeDir(fileDir)
				this.explorerState.emit('removedFile', {
					filePath,
				})
			})
			.on('addDir', (folderPath: string) => {
				this.explorerState.emit('newFolder', {
					containerFolder: normalizeDir(path.dirname(folderPath)),
					folderName: path.basename(folderPath),
				})
			})
			.on('unlinkDir', (folderDir: string) => {
				const folderPath = normalizeDir(folderDir)
				this.explorerState.emit('removedFolder', {
					folderPath,
				})
			})
		return projectWatcher
	}
	/*
	 *
	 * Create all the event listeners.
	 *
	 */
	private async _addListeners() {
		RunningConfig.on<any>(['aTabHasBeenSaved', 'aFileHasBeenChanged', 'aFileHasBeenCreated', 'aFolderHasBeenCreated', 'aFileHasBeenRemoved', 'aFolderHasBeenRemoved'], async ({ parentFolder }) => {
			if (this.isGitRepo && parentFolder.includes(this.projectPath)) {
				const gitChanges = await this._getGitChanges()
				RunningConfig.emit('gitStatusUpdated', {
					gitChanges,
					parentFolder: this.projectPath,
					branch: this.gitChanges.current,
					anyChanges: this.gitChanges.files.length > 0,
				})
			}
		})

		const toggledFSWatcherListener = StaticConfig.keyChanged('editorFSWatcher', async (status: boolean) => {
			if (status) {
				if (!this.filesWatcher) {
					this.filesWatcher = await this.createProjectWatcher()
				}
			} else {
				if (this.filesWatcher) {
					this.filesWatcher.close()
					this.filesWatcher = null
				}
			}
		})

		const toggledGitIntegrationListener = StaticConfig.keyChanged('editorGitIntegration', status => {
			if (status) {
				if (!this.gitWatcher) {
					this.gitWatcher = this.createGitWatcher()
				}
			} else {
				if (this.gitWatcher) {
					this.gitWatcher.close()
					this.gitWatcher = null
				}
			}
		})

		if (StaticConfig.data.editorFSWatcher) {
			// Initialize Files Watcher
			this.filesWatcher = await this.createProjectWatcher()
		}
		if (StaticConfig.data.editorGitIntegration) {
			// Initialize the git watcher
			this.gitWatcher = this.createGitWatcher()
		}

		const createItemListener = this.explorerState.on('createItem', ({ container, directory, level, isFolder = false, isHidden }) => {
			if (container.children[1] == null) {
				//Folder is not opened
				return
			}
			const possibleClass = getClassByDir(normalizeDir(directory))
			if (document.getElementsByClassName(possibleClass)[0] == null) {
				//Might have been already created by watcher
				if (isFolder) {
					RunningConfig.emit('aFolderHasBeenCreated', {
						parentFolder: this.folderPath,
						folderPath: directory,
					})
				} else {
					RunningConfig.emit('aFileHasBeenCreated', {
						parentFolder: this.folderPath,
						filePath: directory,
					})
				}
				const itemComputed = getItemComputed({
					explorerProvider: this.explorerProvider,
					projectPath: this.projectPath,
					classSelector: possibleClass,
					fullPath: directory,
					level: Number(level) + 1,
					isFolder,
					gitChanges: this.itemElement.gitChanges,
					explorerContainer: container,
					isHidden,
				})
				const hotItem = itemComputed
				if (isFolder) {
					const folderPosition = getlastFolderPosition(container.children[1])
					render(hotItem, container.children[1], {
						position: folderPosition,
					})
				} else {
					render(hotItem, container.children[1])
				}
			}
		})
		this.explorerState.once('destroyed', () => {
			toggledFSWatcherListener.cancel()
			toggledGitIntegrationListener.cancel()
			createItemListener.cancel()
		})
	}
	/*
	 *
	 * Remove all project explorers in the side panel.
	 *
	 */
	private _removeExistingExplorers() {
		if (this.replaceOldExplorer && this.container.children[0]) {
			for (let otherExplorer of <any>this.container.children[0].children) {
				const explorerPath = otherExplorer.getAttribute('fullpath')
				if (explorerPath) {
					RunningConfig.emit('removeFolderFromRunningWorkspace', {
						folderPath: explorerPath,
					})
				}
			}
		}
	}
	/*
	 *
	 * Init the explorer.
	 *
	 */
	async init() {
		const self = this
		if (this.level === 0) {
			this.isGitRepo = await this._isGitRepo()
			this.classSelector = getClassByDir(normalizeDir(this.folderPath))
			this._markContainerAsExplorer()

			if (this.isGitRepo) {
				this.gitChanges = await this._getGitChanges()
				RunningConfig.emit('loadedGitRepo', {
					gitChanges: this.gitChanges,
					branch: this.gitChanges.current,
					parentFolder: this.folderPath,
					anyChanges: this.gitChanges.files.length > 0,
					explorerProvider: this.explorerProvider,
				})
			}
			const itemComputed = getItemComputed({
				explorerProvider: this.explorerProvider,
				projectPath: this.projectPath,
				classSelector: this.classSelector,
				fullPath: normalizeDir(this.folderPath),
				level: 0,
				isFolder: true,
				gitChanges: this.gitChanges,
				explorerContainer: null,
				decorator: this.explorerProvider.decorator,
				isHidden: false,
			})
			const mounted = function () {
				this.gitChanges = self.gitChanges
				self.explorerState = this.state
				self.itemElement = this
				self._addListeners()
			}
			const explorerContainer = element({
				components: {
					itemComputed: () => itemComputed,
				},
			})`<itemComputed mounted="${mounted}" />`

			this._removeExistingExplorers()

			render(explorerContainer, this.container)
		} else {
			this.explorerProvider
				.listDir(this.folderPath)
				.then((paths: Array<any>) => {
					let dirs: Array<any> = paths
						.map(({ name, isFolder, isHidden }) => {
							//Load folders
							const itemDirectory = normalizeDir(path.join(this.folderPath, name))
							if (isFolder)
								return getItemComputed({
									explorerProvider: this.explorerProvider,
									projectPath: this.projectPath,
									classSelector: getClassByDir(itemDirectory),
									fullPath: itemDirectory,
									level: this.level,
									isFolder: true,
									gitChanges: this.gitChanges,
									explorerContainer: this.container,
									isHidden,
								})
						})
						.filter(Boolean)
					dirs = [
						...dirs,
						paths
							.map(({ name, isFolder, isHidden }) => {
								//Load files
								const itemDirectory = normalizeDir(path.join(this.folderPath, name))
								if (!isFolder)
									if (!name.match('~'))
										return getItemComputed({
											explorerProvider: this.explorerProvider,
											projectPath: this.projectPath,
											classSelector: getClassByDir(itemDirectory),
											fullPath: itemDirectory,
											level: this.level,
											isFolder: false,
											gitChanges: this.gitChanges,
											explorerContainer: this.container,
											isHidden,
										})
							})
							.filter(Boolean),
					].flat()
					const explorerComponent = element`
						<div style="padding:0px 7px;">
							${dirs}
						</div>
					`
					render(explorerComponent, this.container)
				})
				.catch((err: string) => {
					console.error(err)
					new Notification({
						title: 'Error',
						content: err,
					})
				})
		}
	}
}

function getClassByDir(dir: string) {
	return dir.replace(/ /gm, '')
}

function getItemComputed({ isHidden, decorator = null, explorerProvider, classSelector = '', projectPath, fullPath, level, isFolder, gitChanges, explorerContainer }) {
	return new FileItem({
		projectPath,
		isFolder,
		level,
		fullPath,
		classSelector,
		gitChanges,
		hint: beautifyDir(fullPath),
		explorerContainer,
		explorerProvider,
		decorator,
		isHidden,
	})
}

function getlastFolderPosition(container: HTMLElement) {
	const items = container.children
	return Number(
		Object.keys(items).find(index => {
			const item = items[index]
			return item.getAttribute('isFolder') == 'false' ? index : null
		}),
	)
}

export default FilesExplorer
