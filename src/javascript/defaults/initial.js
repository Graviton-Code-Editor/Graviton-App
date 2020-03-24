import { Panel, removePanel } from '../constructors/panel'
import { Shortcuts } from 'shortcuts'
import { loadAutomatically } from '../utils/extension.loader'
import { puffin } from '@mkenzo_8/puffin'
import { openFolder, openFile } from '../utils/filesystem'
import Menu from "../constructors/menu";
import Settings from './windows/settings'
import Welcome from "./windows/welcome";
import ExtensionsRegistry from 'ExtensionsRegistry'
import Arctic from '../themes/arctic'
import Night from '../themes/night'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import About from './dialogs/about'
import CommandPrompt from '../constructors/command.prompt'
import Languages from '../../../languages/*.json'
import StatusBarItem from '../constructors/status.bar.item'
import requirePath from '../utils/require'
import ThemeProvider from '../utils/themeprovider';
import Plus from '../components/icons/plus'
import Minus from '../components/icons/minus'
import configEditor from './tabs/config.editor.js'

const fs = requirePath("fs-extra")
const { openExternal: openLink } = requirePath("electron").shell
const { getCurrentWindow } = requirePath("electron").remote

function init(){
	loadAutomatically()
	new Menu({ //FILE
			button:'File',
			list:[
				{
					label:'Open File',
					action:()=>{
						openFile().then(function(filePath){
							RunningConfig.emit('loadFile',{
								filePath
							})
						})
					}
				},
				{
					label:'Open Folder',
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
					label:'Open workspace',
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
     })
		new Menu({ //TOOLS
			button:'Tools',
			list:[
				{
					label:'Open Settings',
					action:()=>Settings().launch()
				},
				{
					label:'Open Welcome',
					action:()=>Welcome().launch()
				}
			]
		})
		new Menu({ //EDITOR
			button:'Editor',
			list:[
				{
					label:'New panel',
					action:()=> new Panel()
				}
			]
		})
		new Menu({ //Window
			button:'Window',
			list:[
				{
					label:'Default zoom',
					action:()=> {
						StaticConfig.data.appZoom = 1
					}
				},
				{
					label:'Increase zoom',
					action:()=> {
						StaticConfig.data.appZoom += 0.1
					}
				},
				{
					label:'Decrease zoom',
					action:()=> {
						StaticConfig.data.appZoom -= 0.1
					}
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
					label:'Website',
					action:()=>{
						openLink('https://graviton.ml/')
					}
				},{
					label:'Source code',
					action:()=>{
						openLink('https://github.com/Graviton-Code-Editor/Graviton-App')
					}
				},
				{
					label:'About',
					action:About().launch
				}
			]
		})
	new Panel() //Initial Panel
	new StatusBarItem({
		component:Plus,
		position:'right',
		action:()=>{
			StaticConfig.data.appZoom += 0.1
		}
	})
	new StatusBarItem({
		component:Minus,
		position:'right',
		action:()=>{
			StaticConfig.data.appZoom -= 0.1
		}
	})
	ExtensionsRegistry.add(Arctic)    
	ExtensionsRegistry.add(Night)  
	
	RunningConfig.on('command.saveCurrentFile',()=>{
		RunningConfig.data.focusedTab && RunningConfig.data.focusedTab.props.state.emit('savedMe')
	})
	RunningConfig.on('command.newPanel',()=>{
		new Panel()
	})
	RunningConfig.on('command.closeCurrentTab',()=>{
		if( RunningConfig.data.focusedTab != null ) { //Check if there is any opened tab
			RunningConfig.data.focusedTab.props.state.emit('close')
		}
	})
	RunningConfig.on('command.closeCurrentPanel',()=>{
		removePanel()
	})
	RunningConfig.on('command.openCommandPrompt',()=>{
		new CommandPrompt({
			name:'global',
			showInput:true,
			inputPlaceHolder:'Enter a command',
			options:[
				{
					label:'Open Settings'
				},{
					label:'Open Projects'
				},{
					label:'Open Workspaces'
				},{
					label:'Open About'
				},{
					label:'Open Manual Configuration'
				},{
					label:'Set theme'
				},{
					label:'Set Language'
				},
				...RunningConfig.data.globalCommandPrompt
			],
			onSelected(res){
				switch(res.label){
					case 'Open Settings':
						Settings().launch()
						break;
					case 'Open Projects':
						Welcome().launch()
						break;
					case 'Open Workspaces':
						Welcome({
							defaultPage : 'workspaces'
						}).launch()
						break;
					case 'Open Manual Configuration':
						configEditor()	
						break;
					case 'Open About':
						About().launch()
						break;
					case 'Set theme':
						const configuredTheme = StaticConfig.data.appTheme
						new CommandPrompt({
							showInput:true,
							inputPlaceHolder:'Select a theme',
							options:(function(){
								const list = []
								const registry = ExtensionsRegistry.registry.data.list
								Object.keys(registry).filter(function(name){
									const extension = registry[name]
									if(extension.type == "theme"){
										list.push({
											label:name,
											selected:configuredTheme == name
										})
									}
								})
								return list;
							})(),
							onSelected(res){
								StaticConfig.data.appTheme = res.label
							},
							onScrolled(res){
								StaticConfig.data.appTheme = res.label
							}
						})
						break;
					case 'Set Language':
						const configuredLanguage = StaticConfig.data.language
						new CommandPrompt({
							showInput:true,
							inputPlaceHolder:'Select a language',
							options:(function(){
								const list = []
								Object.keys(Languages).filter(function(name){
									list.push({
										label:name,
										selected:configuredLanguage == name
									})
								})
								return list;
							})(),
							onSelected(res){
								StaticConfig.data.appLanguage = res.label
							},
							onScrolled(res){
								StaticConfig.data.appLanguage = res.label
							}
						})
						break;
				}
			}
		})
	})
	RunningConfig.on('command.openCurrentPanelTabsIterator',()=>{
		if( RunningConfig.data.focusedTab ){
			const focusedPanelTabs = RunningConfig.data.focusedTab.getPanelTabs()
			new CommandPrompt({
				name:'tab_switcher',
				showInput:false,
				scrollOnTab:true,
				closeOnKeyUp:true,
				inputPlaceHolder:'Enter a command',
				options:[...focusedPanelTabs.map((tab)=>{
					return {
						label:tab.fileName
					}
				})],
				onSelected(res){
					const toFocusTab = focusedPanelTabs.filter((tab)=>{
						return tab.fileName == res.label
					})[0]
					toFocusTab && toFocusTab.element.props.state.emit('focusedMe')
				}
			})
		}
	})
	const appShortCuts = new Shortcuts ();
	appShortCuts.add ([ 
		...StaticConfig.data.appShortCuts.SaveCurrentFile.combos.map(shortcut=>{ 
			return { 
				shortcut:shortcut, handler: event => RunningConfig.emit('command.saveCurrentFile')
			}
		}),
		...StaticConfig.data.appShortCuts.NewPanel.combos.map(shortcut=>{ 
			return { 
				shortcut:shortcut, handler: event => RunningConfig.emit('command.newPanel')
			}
		}),
		...StaticConfig.data.appShortCuts.CloseCurrentTab.combos.map(shortcut=>{
			console.log(shortcut)
			return { 
				shortcut:shortcut, handler: event => RunningConfig.emit('command.closeCurrentTab')
			}
		}),
		...StaticConfig.data.appShortCuts.CloseCurrentPanel.combos.map(shortcut=>{ 
			return { 
				shortcut:shortcut, handler: event => RunningConfig.emit('command.closeCurrentPanel')
			}
		}),
		...StaticConfig.data.appShortCuts.OpenCommandPrompt.combos.map(shortcut=>{ 
			return { 
				shortcut:shortcut, handler: event => RunningConfig.emit('command.openCommandPrompt')
			}
		}),
		...StaticConfig.data.appShortCuts.IterateCurrentPanelTabs.combos.map(shortcut=>{ 
			return { 
				shortcut:shortcut, handler: event => RunningConfig.emit('command.openCurrentPanelTabsIterator')
			}
		})
	]);
	RunningConfig.emit('appLoaded')
	if(RunningConfig.data.arguments[0] != null){
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