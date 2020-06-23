import * as puffin from '@mkenzo_8/puffin'
import * as drac from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import PluginsRegistry from 'PluginsRegistry'
import path from 'path'
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
import SideMenu from '../components/window/side.menu'
import { EditorClient } from '../constructors/editorclient'
import EnvClient from '../constructors/env.client'
import SidePanel from '../constructors/side.panel'
import Explorer from '../constructors/explorer'

const fs = window.require('fs-extra')
const pluginsPath = path.join(StaticConfig.data.appConfigPath, 'plugins')
const isDev = window.require('electron-is-dev')

const getPlugin = pluginPath => require(pluginPath)

function loadMainFile({ mainDev, main, name, type, PATH }) {
	if (main) {
		let mainPath
		if (isDev || RunningConfig.data.isDebug) {
			if (mainDev && fs.existsSync(path.join(PATH, mainDev))) {
				mainPath = path.join(PATH, mainDev) //DEV version
			} else {
				mainPath = path.join(PATH, main) //BUILT version
			}
		} else {
			if (main && fs.existsSync(path.join(PATH, main))) {
				mainPath = path.join(PATH, main) //BUILT version
			} else {
				mainPath = path.join(PATH, mainDev) //DEV version
			}
		}
		if (type === 'plugin') {
			const parameters = {
				StaticConfig,
				RunningConfig,
				Window,
				puffin,
				Menu,
				Dialog,
				StatusBarItem,
				ContextMenu,
				Notification,
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
			}
			if (!isDev) {
				try {
					window.require(mainPath).entry(parameters)
				} catch (err) {
					throwError(`(${name}) -> ${err}`, err)
				}
			} else {
				window.require(mainPath).entry(parameters)
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

function loadPlugin(pluginPkg) {
	loadMainFile(pluginPkg)
	loadCodeMirror(pluginPkg)
}

RunningConfig.on('appLoaded', function () {
	fs.readdir(pluginsPath).then(paths => {
		paths.map(pluginName => {
			const pluginPath = path.join(pluginsPath, pluginName)
			const pkgPluginPath = path.join(pluginPath, 'package.json')
			if (fs.existsSync(pkgPluginPath)) {
				const pluginPkg = getPlugin(pkgPluginPath)
				if (!pluginPkg.type) pluginPkg.type = 'plugin' //Fallback to plugin type if no one is specified
				pluginPkg.PATH = pluginPath
				PluginsRegistry.add(pluginPkg)
			}
		})
		RunningConfig.emit('allPluginsLoaded')
		loadAllPlugins()
	})
})

function loadAllPlugins() {
	Object.keys(PluginsRegistry.registry.data.list).map(pluginName => {
		const pluginPkg = PluginsRegistry.registry.data.list[pluginName]
		loadPlugin(pluginPkg)
	})
}

function throwError(message, err) {
	if (RunningConfig.data.isDebug || isDev) {
		throw Error(err)
	} else {
		console.log(`%cERR::%c ${message}`, 'color:rgb(255,35,35)', 'color:white')
	}
}

export { loadPlugin }
