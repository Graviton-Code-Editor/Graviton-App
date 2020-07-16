import { element, render, style, state } from '@mkenzo_8/puffin'
import FileItem from '../components/explorer/file.item'
import parseDirectory from '../utils/directory.parser'
import normalizeDir from '../utils/directory.normalizer'
import beautifyDir from '../utils/directory.beautifier'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import Notification from './notification'
import fs from 'fs-extra'
import simpleGit from 'simple-git'
import path from 'path'
const chokidar = window.require('chokidar')

function checkIfProjectIsGit(path) {
	const repoPath = normalizeDir(path)
	const simpleInstance = simpleGit(repoPath)
	return new Promise((resolve, reject) => {
		simpleInstance.checkIsRepo((err, res) => {
			if (!err) {
				resolve(res)
			} else {
				resolve(false)
			}
		})
	})
}

function getStatus(path) {
	const simpleInstance = simpleGit(path)
	return new Promise(resolve => {
		simpleInstance.status((err, res) => {
			resolve(res)
		})
	})
}

function createWatcher(dirPath, explorerState, isGitRepo) {
	const folderPath = normalizeDir(dirPath)
	const gitWatcherPath = normalizeDir(path.join(folderPath, '.git', 'logs', 'HEAD'))
	const projectWatcher = chokidar.watch(folderPath, {
		ignored: /(.git)|(node_modules)|(dist)|(.cache)/g,
		persistent: true,
		interval: 250,
		ignoreInitial: true,
	})
	projectWatcher
		.on('add', filePath => {
			explorerState.emit('newFile', {
				containerFolder: normalizeDir(path.dirname(filePath)),
				fileName: path.basename(filePath),
			})
		})
		.on('change', async fileDir => {
			const filePath = normalizeDir(fileDir)
			explorerState.emit('changedFile', {
				filePath,
			})
		})
		.on('unlink', fileDir => {
			const filePath = normalizeDir(fileDir)
			explorerState.emit('removedFile', {
				filePath,
			})
		})
		.on('addDir', folderPath => {
			explorerState.emit('newFolder', {
				containerFolder: normalizeDir(path.dirname(folderPath)),
				folderName: path.basename(folderPath),
			})
		})
		.on('unlinkDir', folderDir => {
			const folderPath = normalizeDir(folderDir)
			explorerState.emit('removedFolder', {
				folderPath,
			})
		})
	let gitWatcher
	if (isGitRepo) {
		gitWatcher = chokidar.watch(gitWatcherPath, {
			persistent: true,
			interval: 400,
			ignoreInitial: true,
		})
		gitWatcher.on('change', async () => {
			const gitChanges = await getStatus(folderPath)
			RunningConfig.emit('gitStatusUpdated', {
				gitChanges,
				branch: gitChanges.current,
				parentFolder: folderPath,
				anyChanges: gitChanges.files.length > 0,
			})
		})
	}
	return {
		projectWatcher,
		gitWatcher,
	}
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

async function FilesExplorer(folderPath, parent, level = 0, replaceOldExplorer = true, gitChanges = null) {
	if (level === 0) {
		parent.setAttribute('hasFiles', true)
		let gitResult = await checkIfProjectIsGit(folderPath)
		if (gitResult) {
			gitChanges = await getStatus(folderPath)
			RunningConfig.emit('loadedGitRepo', {
				gitChanges,
				branch: gitChanges.current,
				parentFolder: folderPath,
				anyChanges: gitChanges.files.length > 0,
			})
		}
		const possibleClass = getClassByDir(normalizeDir(folderPath))
		const itemComputed = getItemComputed({
			projectPath: folderPath,
			folderPath,
			classSelector: possibleClass,
			dirPath: normalizeDir(folderPath),
			level: 0,
			isFolder: true,
			gitChanges,
		})
		async function mounted() {
			const target = this
			const explorerState = target.state || new state({})
			let projectWatcher = false
			let gitWatcher = false
			target.state = explorerState
			target.gitChanges = gitChanges
			RunningConfig.on(['aTabHasBeenSaved', 'aFileHasBeenCreated', 'aFolderHasBeenCreated', 'aFileHasBeenRemoved', 'aFolderHasBeenRemoved'], async ({ parentFolder }) => {
				if (gitResult && parentFolder === folderPath) {
					const gitChanges = await getStatus(folderPath)
					RunningConfig.emit('gitStatusUpdated', {
						gitChanges,
						parentFolder,
						branch: gitChanges.current,
						anyChanges: gitChanges.files.length > 0,
					})
				}
			})
			/*
			 * The filesystem watcher is only ignoring node_modules, .git,dist and .cache folders for now.
			 * The Git watcher just watchs the commit message file.
			 */
			explorerState.on('stopedWatcher', () => {
				if (projectWatcher) {
					projectWatcher.close()
					projectWatcher = null
				}
				if (gitWatcher) {
					gitWatcher.close()
					gitWatcher = null
				}
			})
			explorerState.on('startedWatcher', () => {
				if (!projectWatcher) {
					const watchers = createWatcher(folderPath, explorerState, gitResult)
					projectWatcher = watchers.projectWatcher
					gitWatcher = watchers.gitWatcher
				}
			})
			StaticConfig.on('stopWatchers', () => {
				explorerState.emit('stopedWatcher')
			})
			StaticConfig.on('startWatchers', () => {
				explorerState.emit('startedWatcher')
			})
			if (StaticConfig.data.editorFSWatcher) explorerState.emit('startedWatcher')
			explorerState.on('createItem', ({ container, containerFolder, directory, level, isFolder = false }) => {
				if (container === null) return //Folder is not opened
				const possibleClass = getClassByDir(normalizeDir(directory))
				if (document.getElementsByClassName(possibleClass)[0] == null) {
					//Might have been already created by watcher
					console.log(isFolder)
					if (isFolder) {
						RunningConfig.emit('aFolderHasBeenCreated', {
							parentFolder: folderPath,
							path: directory,
						})
					} else {
						RunningConfig.emit('aFileHasBeenCreated', {
							parentFolder: folderPath,
							path: directory,
						})
					}
					const itemComputed = getItemComputed({
						projectPath: folderPath,
						classSelector: possibleClass,
						dirPath: directory,
						level: Number(level) + 1,
						isFolder,
						gitChanges,
						explorerContainer: container,
					})
					const hotItem = itemComputed
					if (container.children[1]) {
						if (isFolder) {
							const folderPosition = getlastFolderPosition(container.children[1])
							render(hotItem, container.children[1], {
								position: folderPosition,
							})
						} else {
							render(hotItem, container.children[1])
						}
					}
				}
			})
		}
		const explorerContainer = element({
			components: {
				itemComputed: () => itemComputed,
			},
		})`<itemComputed mounted="${mounted}"/>`
		if (replaceOldExplorer && parent.children[0]) {
			for (let otherExplorer of parent.children[0].children) {
				const explorerPath = otherExplorer.getAttribute('fullpath')
				if (explorerPath) {
					RunningConfig.emit('removeFolderFromRunningWorkspace', {
						folderPath: explorerPath,
					})
				}
			}
		}
		if (replaceOldExplorer) parent.innerHTML = ''
		render(explorerContainer, parent)
	} else {
		fs.readdir(folderPath)
			.then(paths => {
				let dirs = paths
					.map(itemPath => {
						//Load folders
						const itemDirectory = normalizeDir(path.join(folderPath, itemPath))
						const container = parent
						if (fs.lstatSync(path.join(folderPath, itemPath)).isDirectory())
							return getItemComputed({
								projectPath: container.getAttribute('parentFolder'),
								classSelector: getClassByDir(folderPath),
								dirName: itemPath,
								dirPath: itemDirectory,
								level,
								isFolder: true,
								gitChanges: container.gitChanges,
								explorerContainer: container,
							})
					})
					.filter(Boolean)
				dirs = [
					...dirs,
					paths
						.map(itemPath => {
							//Load files
							const itemDirectory = normalizeDir(path.join(folderPath, itemPath))
							const container = parent
							if (!fs.lstatSync(path.join(folderPath, itemPath)).isDirectory())
								if (!itemPath.match('~'))
									return getItemComputed({
										projectPath: container.getAttribute('parentFolder'),
										classSelector: getClassByDir(folderPath),
										dirName: itemPath,
										dirPath: itemDirectory,
										level,
										isFolder: false,
										gitChanges: container.gitChanges,
										explorerContainer: container,
									})
						})
						.filter(Boolean),
				].flat()
				const explorerComponent = element`
					<div style="padding:0px 7px;">
						${dirs}
					</div>
				`
				render(explorerComponent, parent)
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

function getClassByDir(dir) {
	return dir.replace(/ /gm, '')
}

function getItemComputed({ classSelector = '', projectPath, dirPath, level, isFolder, gitChanges, explorerContainer }) {
	return new FileItem({
		projectPath,
		isFolder,
		level,
		fullpath: dirPath,
		classSelector,
		gitChanges,
		hint: beautifyDir(dirPath),
		explorerContainer,
	})
}

export default FilesExplorer
