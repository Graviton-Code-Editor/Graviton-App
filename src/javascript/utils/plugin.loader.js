import puffin from '@mkenzo_8/puffin'
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
import { EditorClient } from '../constructors/editorclient'
import envClient from '../constructors/env.client'

const fs = window.require("fs-extra")
const pluginsPath = path.join(StaticConfig.data.appConfigPath,'plugins')
const isDev = window.require('electron-is-dev')

const getPlugin = pluginPath => require(pluginPath)

function loadPlugin(pluginPath,pluginName){
	try{
		window.require(pluginPath).entry({
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
			envClient
		})
	}catch(err){
		throwSilentError(`(${pluginName}) -> ${err}`)
	}
}

RunningConfig.on("appLoaded",function(){
	fs.readdir(pluginsPath).then( paths => {
		paths.map( pluginName => {
			const pluginPath = path.join(pluginsPath,pluginName)
			const pkgPluginPath = path.join(pluginPath,'package.json')
			if( fs.existsSync(pkgPluginPath) ){
				const pluginPkg = getPlugin(pkgPluginPath)
				if( !pluginPkg.type ) pluginPkg.type = 'plugin' //Fallback to plugin type if no one is specified
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

function loadAllPlugins(){
	Object.keys(PluginsRegistry.registry.data.list).map( pluginName => {
		const pluginPkg = PluginsRegistry.registry.data.list[pluginName]
		if( pluginPkg.main ){
			let mainPath
			if( isDev ) {
				if( pluginPkg.mainDev && fs.existsSync(path.join(pluginPkg.PATH,pluginPkg.mainDev)) ){
					mainPath = path.join(pluginPkg.PATH,pluginPkg.mainDev) //DEV version
				}else{
					mainPath = path.join(pluginPkg.PATH,pluginPkg.main) //BUILT version
				}
			}else{
				if( pluginPkg.main && fs.existsSync(path.join(pluginPkg.PATH,pluginPkg.main)) ){
					mainPath = path.join(pluginPkg.PATH,pluginPkg.main) //BUILT version
				}else{
					mainPath = path.join(pluginPkg.PATH,pluginPkg.mainDev) //DEV version
				}
			}
			
			/*
			* In dev mode, the dev mode of the plugin has priority
			* In production mode the built version has priority
			*/
			loadPlugin(mainPath,pluginName)
		}  
	})   
}

function throwSilentError(message){
	console.log(`%cERR::%c ${message}`,'color:rgb(255,35,35)','color:white')
}

export { loadPlugin }
