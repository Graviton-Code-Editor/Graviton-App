import Menu from '../constructors/menu'
import Settings from './windows/settings'
import Store from './windows/store'
import Dashboard from './windows/dashboard'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import About from './dialogs/about'
import Notification from 'Constructors/notification'
import openDebugClient from './debug.window'
import checkForUpdates from '../utils/check.updates'
import AppPlatform from 'AppPlatform'
import BrowserWelcome from './windows/browser_welcome'
import { openFolder, openFile } from 'FileSystem'
import Core from 'Core'
const {
	electron: { ipcRenderer, clipboard },
	openExternal,
} = Core

const isBrowser = RunningConfig.data.isBrowser

/*
 * This creates the default Graviton Menus in the top bar
 */
function createMenus() {
	if (AppPlatform === 'darwin') {
		getHelpMenu('Graviton')
	}
	if (!isBrowser) {
		/*
		 * Only display the File menu in the desktop app
		 */
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
					label: 'menus.File.SaveFile',
					action: () => {
						RunningConfig.emit('command.saveCurrentFile')
					},
				},
				{},
				{
					label: 'menus.File.Projects.Projects',
					list: [
						{
							label: 'menus.File.Projects.OpenProjects',
							action: () => {
								Dashboard().launch()
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
								Dashboard({
									defaultPage: 'workspaces',
								}).launch()
							},
						},
						{
							label: 'menus.File.Workspaces.OpenFromFile',
							action: () => {
								RunningConfig.emit('openWorkspaceDialog')
							},
						},
						{},
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
	}
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
				label: 'misc.Copy',
				accelerator: 'CmdOrCtrl+C',
				selector: 'copy:',
				action: () => {
					if (!RunningConfig.data.focusedEditor) return
					const { client, instance } = RunningConfig.data.focusedEditor
					const selectedText = client.do('getSelection', {
						instance,
						action: () => RunningConfig.emit('hideAllFloatingComps'),
					})

					clipboard.writeText(selectedText)

					RunningConfig.emit('writeToClipboard', selectedText)

					setTimeout(() => {
						client.do('doFocus', {
							instance,
						})
					}, 10)
				},
			},
			{
				label: 'misc.Paste',
				accelerator: 'CmdOrCtrl+V',
				selector: 'paste:',
				action: () => {
					if (!RunningConfig.data.focusedEditor) return
					const { client, instance } = RunningConfig.data.focusedEditor
					const { line, ch } = client.do('getCursorPosition', {
						instance,
					})

					client.do('pasteContent', {
						instance,
						from: {
							line: line - 1,
							ch: ch - 1,
						},
						text: clipboard.readText(),
					})

					setTimeout(() => {
						client.do('doFocus', {
							instance,
						})
					}, 10)
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
			(() => {
				if (!isBrowser) {
					return {
						label: 'menus.Tools.OpenStore',
						action: () => Store().launch(),
					}
				}
			})(),
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
				type: 'checkbox',
				label: 'menus.View.Sidebar',
				checked: StaticConfig.data.appEnableSidebar,
				mounted({ setChecked }) {
					StaticConfig.keyChanged('appEnableSidebar', value => {
						setChecked(value)
					})
				},
				action: () => (StaticConfig.data.appEnableSidebar = !StaticConfig.data.appEnableSidebar),
			},
			{
				type: 'checkbox',
				label: 'menus.View.Sidepanel',
				checked: StaticConfig.data.appEnableSidepanel,
				mounted({ setChecked }) {
					StaticConfig.keyChanged('appEnableSidepanel', value => {
						setChecked(value)
					})
				},
				action: () => (StaticConfig.data.appEnableSidepanel = !StaticConfig.data.appEnableSidepanel),
			},
			{},
			{
				type: 'checkbox',
				label: 'menus.View.Terminal',
				checked: StaticConfig.data.appShowTerminal,
				mounted({ setChecked }) {
					StaticConfig.keyChanged('appShowTerminal', value => {
						setChecked(value)
					})
				},
				action: () => (StaticConfig.data.appShowTerminal = !StaticConfig.data.appShowTerminal),
			},
			{},
			{
				label: 'menus.View.CommandPrompt',
				action: () => RunningConfig.emit('command.openCommandPrompt'),
			},
			{
				label: 'menus.View.ExplorerPrompt',
				action: () => RunningConfig.emit('command.openExplorerCommandPrompt'),
			},
		],
	})

	/*
	 * Only display the Window menu in the desktop app
	 */
	if (!isBrowser) {
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
				(() => {
					if (!RunningConfig.data.isDebug) {
						return {
							label: 'menus.Window.Debug.Debug',
							list: [
								{
									label: 'menus.Window.Debug.OpenDebugWindow',
									action: () => openDebugClient(),
								},
							],
						}
					}
				})(),
				(() => {
					if (!RunningConfig.data.isDebug) return {}
				})(),
				{
					label: 'menus.Window.OpenDevTools',
					action: () => ipcRenderer.invoke('toggle-devtools'),
				},
			],
		})
	}

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
							openExternal('https://github.com/marc2332')
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
							openExternal('https://t.me/gravitoneditor')
						},
					},
					{
						label: 'Discord',
						action: () => {
							openExternal('https://discord.gg/gg6CTYA')
						},
					},
				],
			},
			{},
			{
				label: 'menus.Help.Blog',
				action: () => {
					openExternal('https://graviton.netlify.app/blog')
				},
			},
			{
				label: 'menus.Help.Documentation',
				action: () => {
					openExternal('https://graviton.netlify.app/docs')
				},
			},
			{
				label: 'menus.Help.Website',
				action: () => {
					openExternal('https://graviton.netlify.app')
				},
			},
			{
				label: 'menus.Help.SourceCode',
				action: () => {
					openExternal('https://github.com/Graviton-Code-Editor/Graviton-App')
				},
			},
			{},
			{
				label: 'menus.Help.ReportBug',
				action() {
					openExternal('https://github.com/Graviton-Code-Editor/Graviton-App/issues')
				},
			},
			{},
			(() => {
				if (!isBrowser) {
					return {
						label: 'menus.Help.CheckForUpdates',
						action() {
							checkForUpdates(() => {
								new Notification({
									title: 'No updates found',
								})
							})
						},
					}
				}
			})(),
			(() => {
				if (isBrowser) {
					return {
						label: 'menus.Help.ShowWelcome',
						action() {
							BrowserWelcome().launch()
						},
					}
				}
			})(),
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
