import { element, render, state } from '@mkenzo_8/puffin'
import FileItem from '../components/explorer/file.item'
import parseDirectory from '../utils/directory.parser'
import normalizeDir from '../utils/directory.normalizer'
import beautifyDir from '../utils/directory.beautifier'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import Notification from './notification'
import fs from 'fs-extra'
import simpleGit from 'simple-git'
const path = window.require('path')
const chokidar = window.require('chokidar')
import anymatch from 'anymatch'

import { StatusResult } from 'simple-git'
import { ExplorerItem } from '../types/explorer'
import PuffinState from '../types/puffin.state'
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
	/*
	 *
	 * Create a FilesExplorer instance
	 *
	 */
	constructor(folderPath: string, projectPath: string, container: HTMLElement, level: number = 0, replaceOldExplorer: boolean = true, gitChanges: StatusResult = null) {
		this.folderPath = normalizeDir(folderPath)
		this.container = container
		this.level = level
		this.replaceOldExplorer = replaceOldExplorer
		this.gitChanges = gitChanges
		this.projectPath = projectPath

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
		const repoPath = normalizeDir(this.folderPath)
		const simpleInstance = simpleGit(repoPath)
		return new (Promise as any)((resolve, reject) => {
			simpleInstance.checkIsRepo().then((res: boolean) => {
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
		const simpleInstance = simpleGit(this.folderPath)
		return new Promise(resolve => {
			simpleInstance.status((err, res) => {
				resolve(res)
			})
		})
	}
	/*
	 *
	 * Create the git and files watcher.
	 *
	 */
	private createWatcher() {
		const gitWatcherPath = normalizeDir(path.join(this.folderPath, '.git', 'logs', 'HEAD'))
		const projectWatcher = chokidar.watch(this.folderPath, {
			ignored: anymatch(['**/.git/**', '**/node_modules/**', '**/dist/**', '**/.cache/**', ...StaticConfig.data.editorExcludedDirs]),
			persistent: true,
			interval: 250,
			ignoreInitial: true,
		})
		projectWatcher
			.on('add', filePath => {
				this.explorerState.emit('newFile', {
					containerFolder: normalizeDir(path.dirname(filePath)),
					fileName: path.basename(filePath),
				})
			})
			.on('change', async fileDir => {
				const filePath = normalizeDir(fileDir)
				this.explorerState.emit('changedFile', {
					filePath,
				})
			})
			.on('unlink', fileDir => {
				const filePath = normalizeDir(fileDir)
				this.explorerState.emit('removedFile', {
					filePath,
				})
			})
			.on('addDir', folderPath => {
				this.explorerState.emit('newFolder', {
					containerFolder: normalizeDir(path.dirname(folderPath)),
					folderName: path.basename(folderPath),
				})
			})
			.on('unlinkDir', folderDir => {
				const folderPath = normalizeDir(folderDir)
				this.explorerState.emit('removedFolder', {
					folderPath,
				})
			})
		let gitWatcher
		if (this.isGitRepo) {
			gitWatcher = chokidar.watch(gitWatcherPath, {
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
		return {
			projectWatcher,
			gitWatcher,
		}
	}
	/*
	 *
	 * Create all the event listeners.
	 *
	 */
	private _addListeners() {
		RunningConfig.on(['aTabHasBeenSaved', 'aFileHasBeenChanged', 'aFileHasBeenCreated', 'aFolderHasBeenCreated', 'aFileHasBeenRemoved', 'aFolderHasBeenRemoved'], async ({ parentFolder }) => {
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
		/*
		 * The filesystem watcher is only ignoring node_modules, .git,dist and .cache folders for now.
		 * The Git watcher just watchs the commit message file.
		 */
		this.explorerState.on('stopedWatcher', () => {
			if (this.filesWatcher) {
				this.filesWatcher.close()
				this.filesWatcher = null
			}
			if (this.gitWatcher) {
				this.gitWatcher.close()
				this.gitWatcher = null
			}
		})
		this.explorerState.on('startedWatcher', () => {
			if (!this.filesWatcher) {
				const watchers = this.createWatcher()
				this.filesWatcher = watchers.projectWatcher
				this.gitWatcher = watchers.gitWatcher
			}
		})
		StaticConfig.on('stopWatchers', () => {
			this.explorerState.emit('stopedWatcher')
		})
		StaticConfig.on('startWatchers', () => {
			this.explorerState.emit('startedWatcher')
		})
		if (StaticConfig.data.editorFSWatcher) this.explorerState.emit('startedWatcher')
		this.explorerState.on('createItem', ({ container, containerFolder, directory, level, isFolder = false }) => {
			console.log(container)
			if (container.children[1] == null) return //Folder is not opened
			const possibleClass = getClassByDir(normalizeDir(directory))
			if (document.getElementsByClassName(possibleClass)[0] == null) {
				//Might have been already created by watcher
				if (isFolder) {
					RunningConfig.emit('aFolderHasBeenCreated', {
						parentFolder: this.folderPath,
						path: directory,
					})
				} else {
					RunningConfig.emit('aFileHasBeenCreated', {
						parentFolder: this.folderPath,
						path: directory,
					})
				}
				const itemComputed = getItemComputed({
					projectPath: this.projectPath,
					classSelector: possibleClass,
					fullPath: directory,
					level: Number(level) + 1,
					isFolder,
					gitChanges: this.itemElement.gitChanges,
					explorerContainer: container,
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
		if (this.replaceOldExplorer) this.container.innerHTML = ''
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
				})
			}
			const itemComputed = getItemComputed({
				projectPath: this.projectPath,
				classSelector: this.classSelector,
				fullPath: normalizeDir(this.folderPath),
				level: 0,
				isFolder: true,
				gitChanges: this.gitChanges,
				explorerContainer: null,
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
			})`<itemComputed mounted="${mounted}"/>`

			this._removeExistingExplorers()

			render(explorerContainer, this.container)
		} else {
			fs.readdir(this.folderPath)
				.then((paths: any[]) => {
					let dirs: any[] = paths
						.map(itemPath => {
							//Load folders
							const itemDirectory = normalizeDir(path.join(this.folderPath, itemPath))
							if (fs.lstatSync(path.join(this.folderPath, itemPath)).isDirectory())
								return getItemComputed({
									projectPath: this.projectPath,
									classSelector: getClassByDir(itemDirectory),
									fullPath: itemDirectory,
									level: this.level,
									isFolder: true,
									gitChanges: this.gitChanges,
									explorerContainer: this.container,
								})
						})
						.filter(Boolean)
					dirs = [
						...dirs,
						paths
							.map(itemPath => {
								//Load files
								const itemDirectory = normalizeDir(path.join(this.folderPath, itemPath))
								if (!fs.lstatSync(path.join(this.folderPath, itemPath)).isDirectory())
									if (!itemPath.match('~'))
										return getItemComputed({
											projectPath: this.projectPath,
											classSelector: getClassByDir(itemDirectory),
											fullPath: itemDirectory,
											level: this.level,
											isFolder: false,
											gitChanges: this.gitChanges,
											explorerContainer: this.container,
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
				.catch(err => {
					console.error(err)
					new Notification({
						title: 'Error',
						content: err,
					})
				})
		}
	}
}

function getClassByDir(dir) {
	return dir.replace(/ /gm, '')
}

function getItemComputed({ classSelector = '', projectPath, fullPath, level, isFolder, gitChanges, explorerContainer }) {
	return new FileItem({
		projectPath,
		isFolder,
		level,
		fullPath,
		classSelector,
		gitChanges,
		hint: beautifyDir(fullPath),
		explorerContainer,
	})
}

function getlastFolderPosition(container) {
	const items = container.children
	return Number(
		Object.keys(items).find(index => {
			const item = items[index]
			return item.getAttribute('isFolder') == 'false' ? index : null
		}),
	)
}

export default FilesExplorer
