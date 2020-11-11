import StaticConfig from 'StaticConfig'
import FilesExplorer from '../constructors/files.explorer'
import RunningConfig from 'RunningConfig'
import parseDirectory from '../utils/directory_parser'
import InputDialog from '../utils/dialogs/dialog_input'
import Tab from '../constructors/tab'
import Editor from '../constructors/editor'
import PluginsRegistry from 'PluginsRegistry'
import getFormat from '../utils/format_parser'
import normalizeDir from '../utils/directory_normalizer'
import selectFolderDialog from '../utils/dialogs/select_folder'
import selectFileDialog from '../utils/dialogs/select_file'
import LocalExplorer from '../defaults/local.explorer'
import * as path from 'path'
import Core from 'Core'
const { fs } = Core

import { WorkspaceFoldername, WorkspaceFilename } from 'Constants'
const isBrowser = RunningConfig.data.isBrowser

import { AddFolderInWorkspace, AddFolderInWorkspaceFromDialog, SetWorkspace, RemoveWorkspace } from '../types/workspace.ts'

/**
 * Opens a native dialog,
 * so user can select a folder
 * it logs the folder into the log
 * and resolves the returned promise
 * with the just opened folder's path.
 * @returns promise
 */
function openFolder() {
	return new Promise((resolve, reject) => {
		selectFolderDialog()
			.then(projectPath => {
				RunningConfig.emit('addProjectToLog', { projectPath })
				resolve(projectPath)
			})
			.catch(err => {
				reject(err)
			})
	})
}

/**
 * Add a project to the log
 * @param {string} projectPath - Project's path
 */
RunningConfig.on('addProjectToLog', ({ projectPath }) => {
	const projectPathNormalized = normalizeDir(projectPath)
	const matches = StaticConfig.data.appProjectsLog.find(({ directory }) => {
		return directory === projectPathNormalized
	})
	if (!matches) {
		StaticConfig.data.appProjectsLog.splice(0, 0, {
			directory: projectPathNormalized,
		})
		StaticConfig.triggerChange()
	}
})

/**
 * Remove a Project from the log
 * @param {string} projectPath - Project's path
 */
RunningConfig.on('removeProjectFromLog', ({ projectPath }) => {
	const projectsList = StaticConfig.data.appProjectsLog
	const project = projectsList.find(({ directory }) => {
		return directory == projectPath
	})
	const projectIndex = projectsList.indexOf(project)
	StaticConfig.data.appProjectsLog.splice(projectIndex, 1)
	StaticConfig.triggerChange()
})

/**
 * Opens a native dialog,
 * so user can select a file
 * and then it resolves the
 * returned promise with
 * the file's path.
 * @returns promise
 */
function openFile() {
	return new Promise((resolve, reject) => {
		selectFileDialog()
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

/**
 * Returns the configuration
 * of workspace file passed
 * in the first argument.
 * @param {string} path - The workspace's configuration file
 * @returns workspace's config
 */
function getWorkspaceConfig(path): any {
	let error = false
	try {
		window.require(normalizeDir(path))
	} catch {
		error = true
	}
	if (!error) {
		return window.require(normalizeDir(path))
	} else {
		return null
	}
}

/**
 * Watches for loaded files,
 * if there is one loaded it
 * will open an editor for it.
 * @param {string} filePath - The loaded file's path
 *
 * Only in Desktop version
 */
if (!isBrowser) {
	RunningConfig.on('loadFile', ({ filePath }) => {
		const fileDir = normalizeDir(filePath)
		const basename = path.basename(fileDir)
		const fileExtension = getFormat(fileDir)
		const { bodyElement, tabElement, tabState, isCancelled } = new Tab({
			title: basename,
			directory: fileDir,
			isEditor: true,
			explorerProvider: LocalExplorer,
		})
		if (isCancelled) return //Cancels the tab opening
		fs.readFile(fileDir, 'UTF-8').then(data => {
			new Editor({
				language: fileExtension,
				value: data,
				theme: PluginsRegistry.registry.data.list[StaticConfig.data.appTheme].textTheme,
				bodyElement,
				tabElement,
				tabState,
				directory: fileDir,
			})
		})
	})
}

/**
 * Watches for folders added,
 * into the current workspace
 * if that's the case it will
 * open it in the explorer panel.
 * @param {string} folderPath - The added folder's path
 * @param {boolean} replaceOldExplorer - Add it as one more, or close the previous one
 * @param {string} workspacePath - Path to the current loaded workspace
 */
RunningConfig.on('addFolderToRunningWorkspace', async ({ folderPath, replaceOldExplorer = false, workspacePath = RunningConfig.data.workspacePath }: AddFolderInWorkspace) => {
	fs.stat(folderPath)
		.then(() => {
			if (replaceOldExplorer) {
				//Close all opened folers
				removeAllExplorerFolders()
				//Restart workspace configuration
				RunningConfig.data.workspaceConfig = {
					name: null,
					folders: [],
				}
				//Restart workspace settings
				restartWorkspaceSettings()
			}
			const folderDir = normalizeDir(folderPath)
			const explorerPanel = document.getElementById('explorer_panel')
			new FilesExplorer(folderDir, folderDir, explorerPanel, 0, replaceOldExplorer, null, {
				provider: LocalExplorer,
			})
			RunningConfig.data.workspaceConfig.folders.push({
				name: parseDirectory(folderDir),
				path: folderDir,
			})
			if (!workspacePath) {
				RunningConfig.data.workspacePath = null
			}
		})
		.catch(() => {
			//Opened folder doesn't exist
		})
})

/**
 * Opens a native dialog,
 * so user can select a folder
 * to add to the current workspace
 * @param {boolean} replaceOldExplorer - Add it as one more, or close the previous one
 */
RunningConfig.on('addFolderToRunningWorkspaceDialog', ({ replaceOldExplorer = false }: AddFolderInWorkspaceFromDialog) => {
	selectFolderDialog()
		.then(folderPath => {
			RunningConfig.emit('addFolderToRunningWorkspace', {
				folderPath,
				replaceOldExplorer,
				workspacePath: RunningConfig.data.workspacePath,
			})
			if (RunningConfig.data.workspacePath) RunningConfig.emit('saveCurrentWorkspace')
		})
		.catch(err => {
			console.log(err)
		})
})

/**
 * Remove a folder from the
 * current workspace
 * @param {string} folderPath - Folder's path
 */
RunningConfig.on('removeFolderFromRunningWorkspace', ({ folderPath }) => {
	const folderDir = normalizeDir(folderPath)
	RunningConfig.data.workspaceConfig.folders.map(({ path }, index) => {
		if (path === folderDir) {
			RunningConfig.data.workspaceConfig.folders.splice(index, 1)
		}
	})
})

function removeAllExplorerFolders() {
	;[...RunningConfig.data.workspaceConfig.folders].map(({ path }, index) => {
		RunningConfig.emit('removeFolderFromRunningWorkspace', {
			folderPath: path,
		})
	})
}

/**
 * Open a workspace, even
 * if there was already one
 * opened
 * @param {string} workspaceDir - Workspace's path
 *
 * Only in desktop version
 */
if (!isBrowser) {
	RunningConfig.on('setWorkspace', ({ workspacePath }: SetWorkspace) => {
		const workspacePathNormalized = normalizeDir(workspacePath)
		const workspace = getWorkspaceConfig(workspacePathNormalized)
		if (workspace) {
			//Close all opened folers
			removeAllExplorerFolders()
			//Restart workspace configuration
			RunningConfig.data.workspaceConfig = {
				name: workspace.name,
				folders: [],
				settings: workspace.settings || {},
			}
			//Restart workspace settings
			restartWorkspaceSettings()
			//Apply new workspace settings
			setWorkspaceSettings(RunningConfig.data.workspaceConfig.settings)
			RunningConfig.data.workspacePath = workspacePathNormalized
			workspace.folders.forEach(async folder => {
				fs.stat(folder.path, (err, stats) => {
					if (!err) {
						RunningConfig.emit('addFolderToRunningWorkspace', {
							folderPath: normalizeDir(folder.path),
						})
					}
				})
			})
		}
	})
}

/*
 * Make a copy of StaticConfig user's configuration
 */
const originalStaticConfig = { ...StaticConfig.data }
Object.keys(StaticConfig.data).forEach(key => {
	if (!RunningConfig.data.ignoredStaticConfig.hasOwnProperty(key)) {
		//Update the mirror if the setting is not ignored
		originalStaticConfig[key] = StaticConfig.data[key]
	}
})

/*
 * Restart the workspace settings to it's original state
 */
function restartWorkspaceSettings() {
	RunningConfig.data.ignoredStaticConfig = {}
	Object.keys(RunningConfig.data.ignoredStaticConfig).forEach(sett => {
		StaticConfig.data[sett] = originalStaticConfig[sett]
	})
}

/*
 * Change the workspace settings
 */
function setWorkspaceSettings(settings) {
	Object.keys(settings).forEach(sett => {
		RunningConfig.data.ignoredStaticConfig[sett] = settings[sett]
		StaticConfig.data[sett] = settings[sett]
	})
}

/**
 * Open a native dialog,
 * so user can select the
 * workspace cofiguration file
 * it wants to load
 */
RunningConfig.on('openWorkspaceDialog', () => {
	selectFileDialog()
		.then(path => {
			RunningConfig.emit('addWorkspaceToLog', {
				workspacePath: path,
			})
			RunningConfig.emit('setWorkspace', {
				workspacePath: path,
			})
		})
		.catch(err => {
			console.log(err)
		})
})

/**
 * Add a workspace to the log
 * @param {string} workspaceDir - Workspace's path
 */
RunningConfig.on('addWorkspaceToLog', ({ workspacePath }) => {
	const workspacePathNormalized = normalizeDir(workspacePath)
	const matches = StaticConfig.data.appWorkspacesLog.find(workspace => {
		return workspace == workspacePathNormalized
	})
	if (!matches) {
		StaticConfig.data.appWorkspacesLog.push(workspacePathNormalized)
		StaticConfig.triggerChange()
	}
})

/**
 * Save a workspace configuration
 * to it's file
 * @param {string} workspaceDir - Workspace's path
 * @param {string} workspaceConfig - Workspace's configuration object
 */
async function saveConfiguration(workspacePath: string, workspaceSettingsPath: string, workspaceConfig: any) {
	const workspacePathNormalized = normalizeDir(workspacePath)

	if (!(await fs.exists(workspacePathNormalized))) {
		await fs.mkdir(workspacePathNormalized)
	}

	let settings = workspaceConfig

	if (settings?.workspace?.noFolders) {
		settings.folders = []
	}

	const workspaceConfiguration = JSON.stringify(settings, null, 2)

	fs.writeFile(workspaceSettingsPath, workspaceConfiguration, 'UTF-8', err => {
		if (err) throw err
		StaticConfig.triggerChange()
	})
}

/**
 * Save the current loaded
 * workspace, if there is any
 * loaded yet, it will open
 * a native dialog so user
 * can select where to save the
 * workspace configuration file
 */
RunningConfig.on('saveCurrentWorkspace', function () {
	if (RunningConfig.data.workspacePath) {
		const workspaceFolderPath = path.dirname(RunningConfig.data.workspacePath)
		saveConfiguration(workspaceFolderPath, RunningConfig.data.workspacePath, RunningConfig.data.workspaceConfig)
	} else {
		selectFolderDialog().then((res: string) => {
			InputDialog({
				title: 'Name your workspace',
				placeHolder: 'My workspace',
			}).then((name: string) => {
				const workspaceFolderPath = path.join(res, WorkspaceFoldername)
				const workspaceSettingsPath = path.join(workspaceFolderPath, WorkspaceFilename)
				RunningConfig.data.workspacePath = workspaceSettingsPath
				RunningConfig.data.workspaceConfig.name = name
				saveConfiguration(workspaceFolderPath, workspaceSettingsPath, RunningConfig.data.workspaceConfig)
				RunningConfig.emit('addWorkspaceToLog', {
					workspacePath: workspaceSettingsPath,
				})
			})
		})
	}
})

/**
 * Remove a workspace from the log
 * @param {string} workspacePath - Workspace's path
 */
RunningConfig.on('removeWorkspaceFromLog', ({ workspacePath }: RemoveWorkspace) => {
	const workspacesList = StaticConfig.data.appWorkspacesLog
	const workspaceConf = workspacesList.find((path: string) => {
		return path == workspacePath
	})
	const workspaceIndex = workspacesList.indexOf(workspaceConf)
	StaticConfig.data.appWorkspacesLog.splice(workspaceIndex, 1)
	StaticConfig.triggerChange()
})

/**
 * Rename a workspace
 * @param {string} workspacePath - Workspace's path
 * @param {string} name - New workspace's name
 */
RunningConfig.on('renameWorkspace', ({ workspacePath, name = '' }) => {
	const workspaceFolderPath = path.dirname(workspacePath)
	const workspaceConfig = getWorkspaceConfig(normalizeDir(workspacePath))
	if (workspaceConfig) {
		workspaceConfig.name = name
		saveConfiguration(workspaceFolderPath, workspacePath, workspaceConfig)
	}
})

/**
 * Open a Graviton dialog
 * so user can type the
 * new workspace's name
 * @param {string} workspacePath - Workspace's path
 * @param {string} name - Current workspace's name
 * @param {function} onFinished - A callback
 */
RunningConfig.on('renameWorkspaceDialog', function ({ workspacePath, name = 'My other workspace', onFinished }: { workspacePath: string; name: string; onFinished?: (x: string) => void }) {
	const workspacePathNormalized = normalizeDir(workspacePath)
	InputDialog({
		title: 'Rename your workspace',
		placeHolder: name,
	})
		.then((name: string) => {
			RunningConfig.emit('renameWorkspace', {
				workspacePath: workspacePathNormalized,
				name,
			})
			if (onFinished) onFinished(name)
		})
		.catch((err: string) => {
			console.log(err)
		})
})

export { getWorkspaceConfig, openFolder, openFile, setWorkspaceSettings, restartWorkspaceSettings }
