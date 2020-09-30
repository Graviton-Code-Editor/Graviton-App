import { openFolder, openFile } from '../utils/filesystem'
import Menu from '../constructors/menu'
import Settings from './windows/settings'
import Store from './windows/store'
import Welcome from './windows/welcome'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import About from './dialogs/about'
import Notification from '../constructors/notification'
import openDebugClient from './debug.window'
import packageJSON from 'Root/package.json'
const { openExternal: openLink } = window.require('electron').shell
import checkForUpdates from '../utils/check.updates'
import AppPlatform from 'AppPlatform'
import { ipcRenderer } from 'electron'

/*
 * This creates the default Graviton Menus in the top bar
 */
function createMenus() {
	if (AppPlatform === 'darwin') {
		getHelpMenu('Graviton')
	}
	new Menu({
		//FILE
		button: 'menus.File.File',
		list: [
			{
				label: 'menus.File.OpenFile',
				action: () => {
					openFile().then(function (filePath) {
						RunningConfig.emit('loadFile', {
							filePath,
						})
					})
				},
			},
			{
				label: 'menus.File.OpenFolder',
				action: () => {
					openFolder().then(function (folderPath) {
						RunningConfig.emit('addFolderToRunningWorkspace', {
							folderPath,
							replaceOldExplorer: true,
							workspacePath: null,
						})
					})
				},
			},
			{},
			{
				label: 'menus.File.Projects.Projects',
				list: [
					{
						label: 'menus.File.Projects.OpenProjects',
						action: () => {
							Welcome().launch()
						},
					},
				],
			},
			{
				label: 'menus.File.Workspaces.Workspaces',
				list: [
					{
						label: 'menus.File.Workspaces.OpenWorkspaces',
						action: () => {
							Welcome({
								defaultPage: 'workspaces',
							}).launch()
						},
					},
					{},
					{
						label: 'menus.File.Workspaces.OpenFromFile',
						action: () => {
							RunningConfig.emit('openWorkspaceDialog')
						},
					},
					{
						label: 'menus.File.Workspaces.AddFolderToWorkspace',
						action: () => {
							RunningConfig.emit('addFolderToRunningWorkspaceDialog', {
								replaceOldExplorer: false,
							})
						},
					},
					{
						label: 'menus.File.Workspaces.SaveWorkspace',
						action: () => {
							RunningConfig.emit('saveCurrentWorkspace')
						},
					},
				],
			},
		],
	})
	new Menu({
		//EDIT
		button: 'menus.Edit.Edit',
		list: [
			{
				label: 'menus.Edit.Undo',
				action: () => {
					if (!RunningConfig.data.focusedEditor) return
					const { client, instance } = RunningConfig.data.focusedEditor
					client.do('executeUndo', {
						instance,
					})
				},
			},
			{
				label: 'menus.Edit.Redo',
				action: () => {
					if (!RunningConfig.data.focusedEditor) return
					const { client, instance } = RunningConfig.data.focusedEditor
					client.do('executeRedo', {
						instance,
					})
				},
			},
			{},
			{
				label: 'menus.Edit.FontSize.FontSize',
				list: [
					{
						label: 'menus.Edit.FontSize.Increase',
						action: () => {
							RunningConfig.emit('command.increaseFontSize')
						},
					},
					{
						label: 'menus.Edit.FontSize.Decrease',
						action: () => {
							RunningConfig.emit('command.decreaseFontSize')
						},
					},
				],
			},
			{},
			{
				label: 'menus.Edit.Find',
				action: () => {
					if (!RunningConfig.data.focusedEditor) return
					const { client, instance } = RunningConfig.data.focusedEditor
					client.do('openFind', {
						instance,
					})
				},
			},
			{
				label: 'menus.Edit.Replace',
				action: () => {
					if (!RunningConfig.data.focusedEditor) return
					const { client, instance } = RunningConfig.data.focusedEditor
					client.do('openReplace', {
						instance,
					})
				},
			},
			{},
			{
				label: 'menus.Edit.FormatDocument',
				action: () => {
					if (!RunningConfig.data.focusedEditor) return
					const { client, instance } = RunningConfig.data.focusedEditor
					client.do('doIndent', {
						instance,
					})
				},
			},
		],
	})
	new Menu({
		//TOOLS
		button: 'menus.Tools.Tools',
		list: [
			{
				label: 'menus.Tools.OpenSettings',
				action: () => Settings().launch(),
			},
			{
				label: 'menus.Tools.OpenStore',
				action: () => Store().launch(),
			},
			{},
			{
				label: 'menus.Tools.Panels.Panels',
				list: [
					{
						label: 'menus.Tools.Panels.NewPanel',
						action: () => RunningConfig.emit('command.newPanel'),
					},
					{
						label: 'menus.Tools.Panels.CloseCurrentPanel',
						action: () => RunningConfig.emit('command.closeCurrentPanel'),
					},
				],
			},
		],
	})
	new Menu({
		//VIEW
		button: 'menus.View.View',
		list: [
			{
				label: 'menus.View.ToggleSidebar',
				action: () => (StaticConfig.data.appEnableSidebar = !StaticConfig.data.appEnableSidebar),
			},
			{
				label: 'menus.View.ToggleSidepanel',
				action: () => (StaticConfig.data.appEnableSidepanel = !StaticConfig.data.appEnableSidepanel),
			},
			{},
			{
				label: 'menus.View.ToggleTerminal',
				action: () => (StaticConfig.data.appShowTerminal = !StaticConfig.data.appShowTerminal),
			},
		],
	})
	new Menu({
		//Window
		button: 'menus.Window.Window',
		list: [
			{
				label: 'menus.Window.Zoom.Zoom',
				list: [
					{
						label: 'menus.Window.Zoom.DefaultZoom',
						action: () => {
							StaticConfig.data.appZoom = 1
						},
					},
					{
						label: 'menus.Window.Zoom.IncreaseZoom',
						action: () => {
							StaticConfig.data.appZoom += 0.1
						},
					},
					{
						label: 'menus.Window.Zoom.DecreaseZoom',
						action: () => {
							StaticConfig.data.appZoom -= 0.1
						},
					},
				],
			},
			{},
			{
				label: 'menus.Window.Debug.Debug',
				list: [
					{
						label: 'menus.Window.Debug.OpenDebugWindow',
						action: () => openDebugClient(),
					},
				],
			},
			{},
			{
				label: 'menus.Window.OpenDevTools',
				action: () => ipcRenderer.invoke('toggle-devtools'),
			},
		],
	})
	if (AppPlatform !== 'darwin') {
		getHelpMenu('menus.Help.Help')
	}
}

function getHelpMenu(button) {
	new Menu({
		//HELP
		button,
		list: [
			{
				label: 'menus.Help.Contact',
				list: [
					{
						label: 'Github',
						action: () => {
							openLink('https://github.com/marc2332')
						},
					},
				],
			},
			{
				label: 'menus.Help.Social',
				list: [
					{
						label: 'Telegram',
						action: () => {
							openLink('https://t.me/gravitoneditor')
						},
					},
					{
						label: 'Discord',
						action: () => {
							openLink('https://discord.gg/gg6CTYA')
						},
					},
				],
			},
			{},
			{
				label: 'menus.Help.Contributors',
				list: (() => {
					return packageJSON.contributors.map(({ name, url }) => {
						return {
							label: name,
							action() {
								openLink(url)
							},
						}
					})
				})(),
			},
			{
				label: 'menus.Help.Blog',
				action: () => {
					openLink('https://graviton.netlify.app/blog/')
				},
			},
			{
				label: 'menus.Help.Documentation',
				action: () => {
					openLink('https://github.com/Graviton-Code-Editor/Graviton-App/wiki')
				},
			},
			{
				label: 'menus.Help.Website',
				action: () => {
					openLink('https://graviton.netlify.app/')
				},
			},
			{
				label: 'menus.Help.SourceCode',
				action: () => {
					openLink('https://github.com/Graviton-Code-Editor/Graviton-App')
				},
			},
			{},
			{
				label: 'menus.Help.CheckForUpdates',
				action() {
					checkForUpdates(() => {
						new Notification({
							title: 'No updates found',
						})
					})
				},
			},
			{
				label: 'menus.Help.About',
				action() {
					About().launch()
				},
			},
		],
	})
}

export default createMenus
