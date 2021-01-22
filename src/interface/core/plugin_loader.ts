import * as puffin from '@mkenzo_8/puffin'
import * as drac from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import PluginsRegistry from 'PluginsRegistry'
import CodeMirror from 'codemirror'
import CommandPrompt from '../constructors/command.prompt'
import Window from '../constructors/window'
import Editor from '../constructors/editor'
import Menu from '../constructors/menu'
import Dialog from '../constructors/dialog'
import StatusBarItem from '../constructors/status.bar.item'
import ContextMenu from '../constructors/contextmenu'
import Notification from '../constructors/notification'
import Tab from '../constructors/tab'
import SideMenu from '../components/window/side_menu'
import { EditorClient } from '../constructors/editorclient'
import EnvClient from '../constructors/env_client'
import SidePanel from '../constructors/side.panel'
import Explorer from '../constructors/explorer'
import FilesExplorer from '../constructors/files.explorer'
import throwError from '../utils/throw_error'
import * as path from 'path'
import * as Emotion from '@emotion/css'
import { openFile, openFolder, saveFileAs } from 'FileSystem'
import Core from 'Core'
const { fs } = Core
import { pluginsInternalDir, pluginsExternalDir } from '../utils/plugins_dirs'

const getPlugin = (pluginPath: string) => window.require(pluginPath)
const isTesting: boolean = process.env.NODE_ENV === 'test'
const isBrowser = RunningConfig.data.isBrowser

function loadMainFile({ mainDev, main, name, type, PATH, pluginExports }) {
	class PluginNotification extends Notification {
		constructor(params) {
			super({
				...params,
				author: name,
			})
		}
	}

	const parameters = {
		StaticConfig,
		RunningConfig,
		Window,
		puffin,
		Menu,
		Dialog,
		StatusBarItem,
		ContextMenu,
		Notification: PluginNotification,
		CodeMirror,
		Tab,
		drac,
		SideMenu,
		EditorClient,
		EnvClient,
		SidePanel,
		Explorer,
		CommandPrompt,
		Editor,
		FilesExplorer,
		PluginsRegistry,
		Emotion,
		Dialogs: {
			openFile,
			openFolder,
			saveFileAs,
		},
	}
	if (pluginExports) {
		if (type === 'plugin') {
			if (!RunningConfig.data.isDev) {
				try {
					const { entry }: any = pluginExports
					entry(parameters)
				} catch (err) {
					throwError(`(${name}) -> ${err}`, err)
				}
			} else {
				const { entry }: any = pluginExports
				entry(parameters)
			}
		}
	} else if (main) {
		let mainPath
		const mainDevExists = mainDev ? fs.existsSync(path.join(PATH, mainDev)) : false
		if (mainDev && mainDevExists) {
			mainPath = path.join(PATH, mainDev) //DEV version
		} else {
			mainPath = path.join(PATH, main) //BUILT version
		}
		if (type === 'plugin') {
			if (!RunningConfig.data.isDev && !RunningConfig.data.isDebug) {
				try {
					const { entry }: any = window.require(mainPath)
					entry(parameters)
				} catch (err) {
					throwError(`(${name}) -> ${err}`, err)
				}
			} else {
				const { entry }: any = window.require(mainPath)
				entry(parameters)
			}
		}
	}
}

function loadCodeMirror({ type, fileTheme, PATH }) {
	if (type === 'theme' && fileTheme) {
		const style = document.createElement('link')
		style.rel = 'stylesheet'
		style.href = path.join(PATH, fileTheme)
		document.head.appendChild(style)
	}
}

async function loadPlugin(pluginPkg) {
	loadMainFile(pluginPkg)
	loadCodeMirror(pluginPkg)
}

const registerPluginsIn = where => {
	return new Promise<void>((resolve, reject) => {
		fs.readdir(where)
			.then(paths => {
				paths.map(pluginName => {
					const pluginPath: string = path.join(where, pluginName)
					addPluginToRegistry(pluginPath)
				})
				resolve()
			})
			.catch(err => {
				console.error(err)
				new Notification({
					author: 'Graviton',
					title: 'Error',
					content: `Couldn't load some plugins.`,
				})
				resolve()
			})
	})
}

export function addPluginToRegistryStatically(pluginPkg, pluginExports = null) {
	if (!pluginPkg.type) pluginPkg.type = 'plugin' //Fallback to plugin type if no one is specified
	pluginPkg.pluginExports = pluginExports
	PluginsRegistry.add(pluginPkg)
	return pluginPkg
}

/*
 * Add a plugin to the runtime plugins registry
 */
export function addPluginToRegistry(pluginPath) {
	const pkgPluginPath: string = path.join(pluginPath, 'package.json')
	if (fs.existsSync(pkgPluginPath)) {
		const pluginPkg = getPlugin(pkgPluginPath)
		if (!pluginPkg.type) pluginPkg.type = 'plugin' //Fallback to plugin type if no one is specified
		pluginPkg.PATH = pluginPath
		PluginsRegistry.add(pluginPkg)
		return pluginPkg
	}
}

/*
 * Unload a plugin from the runtime plugins registry
 */
export function unloadPluginFromRegistry(name) {
	PluginsRegistry.remove(name)
}

/*
 * Load built-in and installed plugins when the app is loaded
 */
RunningConfig.on('appLoaded', async function () {
	if (!RunningConfig.data.isBrowser) {
		await registerPluginsIn(pluginsInternalDir())
		if (!isTesting) await registerPluginsIn(pluginsExternalDir())
	}
	RunningConfig.emit('allPluginsLoaded')

	let preventRunningPlugins = false

	if (!isBrowser) {
		if (eval('window.process.env.NODE_ENV') === 'test') {
			preventRunningPlugins = true
		}
	}

	if (!preventRunningPlugins) {
		loadAllPlugins()
	}
})

function loadAllPlugins() {
	Object.keys(PluginsRegistry.registry.data.list).map(pluginName => {
		const pluginPkg = PluginsRegistry.registry.data.list[pluginName]
		loadPlugin(pluginPkg)
	})
}

export { loadPlugin }
