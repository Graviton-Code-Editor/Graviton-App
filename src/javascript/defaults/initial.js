import { Panel, removePanel } from '../constructors/panel'
import { registryAllPlugins } from '../utils/plugin.loader'
import { puffin } from '@mkenzo_8/puffin'
import { openFolder, openFile } from '../utils/filesystem'
import Menu from "../constructors/menu";
import Settings from './windows/settings'
import Store from './windows/store'
import Welcome from "./windows/welcome";
import PluginsRegistry from 'PluginsRegistry'
import Arctic from '../themes/arctic'
import Night from '../themes/night'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import About from './dialogs/about'
import Languages from '../../../languages/*.json'
import ThemeProvider from '../utils/themeprovider';
import configEditor from './tabs/config.editor.js'
import ContextMenu from '../constructors/contextmenu'
import './shortcuts'
import './status.bar.items/git'
import './status.bar.items/zoom'


const fs = window.require("fs-extra")
const { openExternal: openLink } = window.require("electron").shell
const { getCurrentWindow } = window.require("electron").remote
const isDev = window.require("electron-is-dev")

function init(){
	new Menu({ //FILE
			button:'File',
			list:[
				{
					label:'OpenFile',
					action:()=>{
						openFile().then(function(filePath){
							RunningConfig.emit('loadFile',{
								filePath
							})
						})
					}
				},
				{
					label:'OpenFolder',
					action:()=>{
						openFolder().then(function(folderPath){
							RunningConfig.emit('addFolderToRunningWorkspace',{
								folderPath,
								replaceOldExplorer:true,
								workspacePath:null
							})
						})
					}
				},
				{},
				{
					label:'Projects',
					list:[
						{
							label:'Open Recents',
							action:()=>{
								Welcome().launch()
							}
						}
					]
				},
				{
					label:'Workspaces',
					list:[
						{
							label:'Open Workspaces',
							action:()=>{
								Welcome({
									defaultPage:'workspaces'
								}).launch()
							}
						},
						{},
						{
							label:'Open from File',
							action:()=>{
								RunningConfig.emit('openWorkspaceDialog')
							}
						},
						{
							label:'Add folder to workspace',
							action:()=>{
								RunningConfig.emit('addFolderToRunningWorkspaceDialog',{
									replaceOldExplorer:false
								})
							}
						},
						{
							label:'Save workspace',
							action:()=>{
								RunningConfig.emit('saveCurrentWorkspace')
							}
						}
					]
				}
			]
     })
		new Menu({ //EDIT
			button:'Edit',
			list:[
				{
					label:'Undo',
					action:()=>{
						if( !RunningConfig.data.focusedEditor ) return
						const { client, instance } = RunningConfig.data.focusedEditor
						client.do('executeUndo',{
							instance
						})
					}
				},
				{
					label:'Redo',
					action:()=>{
						if( !RunningConfig.data.focusedEditor ) return
						const { client, instance } = RunningConfig.data.focusedEditor
						client.do('executeRedo',{
							instance
						})
					}
				},
				{},
				{
					label:'FontSize',
					list:[
						{
							label:'Increase',
							action:()=>{
								RunningConfig.emit('command.increaseFontSize')
							}
						},
						{
							label:'Decrease',
							action:()=>{
								RunningConfig.emit('command.decreaseFontSize')
							}
						}
					]
				},
				{},
				{
					label:'Find',
					action:()=>{
						if( !RunningConfig.data.focusedEditor ) return
						const { client, instance } = RunningConfig.data.focusedEditor
						client.do('openFind',{
							instance
						})
					}
				},
				{
					label:'Replace',
					action:()=>{
						if( !RunningConfig.data.focusedEditor ) return
						const { client, instance } = RunningConfig.data.focusedEditor
						client.do('openReplace',{
							instance
						})
					}
				},
				{},
				{
					label:'Format document',
					action:()=>{
						if( !RunningConfig.data.focusedEditor ) return
						const { client, instance } = RunningConfig.data.focusedEditor
						client.do('doIndent',{
							instance
						})
					}
				}
			]
		})
		new Menu({ //TOOLS
			button:'Tools',
			list:[
				{
					label:'OpenSettings',
					action:()=>Settings().launch()
				},
				{
					label:'OpenStore',
					action:()=>Store().launch()
				},
				{},
				{
					label:'Panels',
					list:[
						{
							label:'New panel',
							action:()=> RunningConfig.emit('command.newPanel')
						},{
							label:'Close current panel',
							action:()=> RunningConfig.emit('command.closeCurrentPanel')
						}
					]
				}
			]
		})
		new Menu({ //Window
			button:'Window',
			list:[
				{
					label:'Zoom',
					list:[
						{
							label:'DefaultZoom',
							action:()=> {
								StaticConfig.data.appZoom = 1
							}
						},
						{
							label:'IncreaseZoom',
							action:()=> {
								StaticConfig.data.appZoom += 0.1
							}
						},
						{
							label:'DecreaseZoom',
							action:()=> {
								StaticConfig.data.appZoom -= 0.1
							}
						}
					]
				},
				{},
				{
					label:'Open dev tools',
					action:()=>getCurrentWindow().toggleDevTools()
				}
			]
		})
		new Menu({ //HELP
			button:'Help',
			list:[
				{
					label:'Blog',
					action:()=>{
						openLink('https://graviton.ml/blog/')
					}
				},{
					label:'Documentation',
					action:()=>{
						openLink('https://github.com/Graviton-Code-Editor/Graviton-App/wiki')
					}
				},{
					label:'Website',
					action:()=>{
						openLink('https://graviton.netlify.app/')
					}
				},{
					label:'SourceCode',
					action:()=>{
						openLink('https://github.com/Graviton-Code-Editor/Graviton-App')
					}
				},
				{
					label:'About',
					action(){
						About().launch()
					}
				}
			]
		})
	new Panel() //Initial Panel
	PluginsRegistry.add(Arctic)    
	PluginsRegistry.add(Night)  
	
	RunningConfig.emit('appLoaded')
	if(RunningConfig.data.arguments[0] != null && !isDev){
		const dir = RunningConfig.data.arguments[0]
		if( fs.lstatSync(dir).isDirectory() ){
			RunningConfig.emit('addFolderToRunningWorkspace',{
				folderPath:RunningConfig.data.arguments[0],
				replaceOldExplorer:true,
				workspacePath:null
			})
		}else{
			RunningConfig.emit('loadFile',{
				filePath:RunningConfig.data.arguments[0]
			})
		}
	}
}

export default init