import { puffin } from '@mkenzo_8/puffin'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import ExtensionsRegistry from 'ExtensionsRegistry'
import path from 'path'
import requirePath from './require'
import CodeMirror from 'codemirror'


import Window from '../constructors/window'
import Menu from '../constructors/menu'
import Dialog from '../constructors/dialog'
import StatusBarItem from '../constructors/status.bar.item'
import ContextMenu from '../constructors/contextmenu'
import Notification from '../constructors/notification'
import Tab from '../constructors/tab'

const fs = requirePath("fs-extra")
const pluginsPath = path.join(StaticConfig.data.appConfigPath,'plugins')
const isDev = requirePath('electron-is-dev')

function getExtension(path){
	return require(path)
}

function loadExtension(path){
	return require(path).entry({
		RunningConfig,
		Window,
		puffin,
		Menu,
		Dialog,
		StatusBarItem,
		ContextMenu,
		Notification,
		CodeMirror,
		Tab
	})
}

function loadAutomatically(){
	RunningConfig.on("appLoaded",function(){
		fs.readdir(pluginsPath).then(function(paths){
			paths.map(function(pluginName){
				const pluginPath = path.join(pluginsPath,pluginName)
				const pkgPluginPath = path.join(pluginPath,'package.json')
				if(fs.existsSync(pkgPluginPath)){
					const pluginPkg = getExtension(pkgPluginPath)
					pluginPkg.PATH = pluginPath
					ExtensionsRegistry.add(
						pluginPkg
					)
				}
			})
			RunningConfig.emit('allExtensionsLoaded')
			entryAllExtensions()
		})
	})
}

function entryAllExtensions(){
	Object.keys(ExtensionsRegistry.registry.data.list).map(function(pluginName){
		const pluginPkg = ExtensionsRegistry.registry.data.list[pluginName]
		if(pluginPkg.main != undefined){
			if( isDev && pluginPkg.mainDev && fs.existsSync(path.join(pluginPkg.PATH,pluginPkg.mainDev)) ){
				loadExtension(path.join(pluginPkg.PATH,pluginPkg.mainDev)) //DEV version
			}else{
				loadExtension(path.join(pluginPkg.PATH,pluginPkg.main)) //BUILT version
			}
		}  
	})   
}

export { loadExtension, loadAutomatically }

/**
 * entry() ->  Initial extension's function, called when the plugin is executed
 */