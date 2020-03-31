import { puffin } from '@mkenzo_8/puffin'
import drac from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import PluginsRegistry from 'PluginsRegistry'
import path from 'path'
import CodeMirror from 'codemirror'

import Window from '../constructors/window'
import Menu from '../constructors/menu'
import Dialog from '../constructors/dialog'
import StatusBarItem from '../constructors/status.bar.item'
import ContextMenu from '../constructors/contextmenu'
import Notification from '../constructors/notification'
import Tab from '../constructors/tab'
import SideMenu from '../components/window/side.menu'

const fs = window.require("fs-extra")
const pluginsPath = path.join(StaticConfig.data.appConfigPath,'plugins')
const isDev = window.require('electron-is-dev')

function getPlugin(path){
	return require(path)
}

function loadPlugin(path){
	return window.require(path).entry({
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
		SideMenu
	})
}

function registryAllPlugins(){
	RunningConfig.on("appLoaded",function(){
		fs.readdir(pluginsPath).then(function(paths){
			paths.map(function(pluginName){
				const pluginPath = path.join(pluginsPath,pluginName)
				const pkgPluginPath = path.join(pluginPath,'package.json')
				if(fs.existsSync(pkgPluginPath)){
					const pluginPkg = getPlugin(pkgPluginPath)
					pluginPkg.PATH = pluginPath
					PluginsRegistry.add(
						pluginPkg
					)
				}
			})
			RunningConfig.emit('allPluginsLoaded')
			loadAllPlugins()
		})
	})
}

function loadAllPlugins(){
	Object.keys(PluginsRegistry.registry.data.list).map(function(pluginName){
		const pluginPkg = PluginsRegistry.registry.data.list[pluginName]
		if(pluginPkg.main != undefined){
			if( isDev && pluginPkg.mainDev && fs.existsSync(path.join(pluginPkg.PATH,pluginPkg.mainDev)) ){
				loadPlugin(path.join(pluginPkg.PATH,pluginPkg.mainDev)) //DEV version
			}else{
				loadPlugin(path.join(pluginPkg.PATH,pluginPkg.main)) //BUILT version
			}
		}  
	})   
}

export { loadPlugin, registryAllPlugins }
