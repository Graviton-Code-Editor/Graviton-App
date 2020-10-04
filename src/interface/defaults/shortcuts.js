import { Shortcuts } from 'shortcuts'
import { Panel, removePanel } from '../constructors/panel'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import CommandPrompt from '../constructors/command.prompt'
import PluginsRegistry from 'PluginsRegistry'
import About from './dialogs/about'
import Languages from '../collections/languages'
import configEditor from './tabs/config.editor.js'
import Settings from './windows/settings'
import Welcome from './windows/welcome'
import Store from './windows/store'
import path from 'path'
const { remote } = window.require('electron')
import fs from 'fs-extra'

RunningConfig.on('command.saveCurrentFile', () => {
	RunningConfig.data.focusedTab && RunningConfig.data.focusedTab.state.emit('savedMe')
})
RunningConfig.on('command.newPanel', () => {
	new Panel()
})
RunningConfig.on('command.closeCurrentTab', () => {
	if (RunningConfig.data.focusedTab) {
		//Check if there is any opened tab
		RunningConfig.data.focusedTab.state.emit('close')
	}
})
RunningConfig.on('command.closeCurrentPanel', () => {
	removePanel()
})
RunningConfig.on('command.openCommandPrompt', () => {
	new CommandPrompt({
		name: 'global',
		showInput: true,
		inputPlaceHolder: 'Enter a command',
		options: [
			{
				label: 'Open Settings',
				action: () => Settings().launch(),
			},
			{
				label: 'Open Projects',
				action: () => Welcome().launch(),
			},
			{
				label: 'Open Workspaces',
				action: () => {
					Welcome({
						defaultPage: 'workspaces',
					}).launch()
				},
			},
			{
				label: 'Open Store',
				action: () => Store().launch(),
			},
			{
				label: 'Open About',
				action: () => About().launch(),
			},
			{
				label: 'Open Manual Configuration',
				action: () => configEditor(),
			},
			{
				label: 'Set Theme',
				action: () => {
					const configuredTheme = StaticConfig.data.appTheme
					const registry = PluginsRegistry.registry.data.list
					new CommandPrompt({
						showInput: true,
						inputPlaceHolder: 'Select a theme',
						options: [
							...Object.keys(registry)
								.map(name => {
									const pluginInfo = registry[name]
									if (pluginInfo.type == 'theme') {
										return {
											label: name,
											selected: configuredTheme === name,
										}
									}
								})
								.filter(Boolean),
						],
						onSelected(res) {
							StaticConfig.data.appTheme = res.label
						},
						onScrolled(res) {
							StaticConfig.data.appTheme = res.label
						},
					})
				},
			},
			{
				label: 'Set zoom',
				action: () => {
					new CommandPrompt({
						showInput: false,
						options: [
							{
								label: 'Default',
								action() {
									StaticConfig.data.appZoom = 1
								},
							},
							{
								label: 'Increase',
								action() {
									StaticConfig.data.appZoom += 0.1
								},
							},
							{
								label: 'Decrease',
								action() {
									StaticConfig.data.appZoom -= 0.1
								},
							},
						],
					})
				},
			},
			{
				label: 'Set Language',
				action: () => {
					const configuredLanguage = StaticConfig.data.language
					new CommandPrompt({
						showInput: true,
						inputPlaceHolder: 'Select a language',
						options: [
							...Object.keys(Languages).map(lang => {
								const languageName = Languages[lang].name
								return {
									data: lang,
									label: languageName,
									selected: configuredLanguage === languageName,
								}
							}),
						],
						onSelected(res) {
							StaticConfig.data.appLanguage = res.data
						},
						onScrolled(res) {
							StaticConfig.data.appLanguage = res.data
						},
					})
				},
			},
			...RunningConfig.data.globalCommandPrompt,
		],
	})
})

RunningConfig.on('command.openExplorerCommandPrompt', () => {
	const currentTab = RunningConfig.data.focusedTab
	const currentTabState = (currentTab && currentTab.state.data) || false
	const currentFileFolder = (currentTabState && currentTabState.parentFolder && `${path.normalize(currentTabState.parentFolder)}/`) || ''

	const showOptions = async (itemPath, setOptions) => {
		if (itemPath === '') return []

		const fileName = path.basename(itemPath)

		const itemExists = await fs.exists(itemPath)
		if (itemExists) {
			const itemData = await fs.lstat(itemPath)
			const isFolder = itemData.isDirectory()
			if (isFolder) {
				const items = await fs.readdir(itemPath)

				setOptions(
					items.map(label => {
						return {
							label,
							action() {
								//
							},
						}
					}),
				)
			}
		} else {
			const parentFolder = path.dirname(itemPath)
			const parentFolderItems = await fs.readdir(parentFolder)

			setOptions(
				parentFolderItems
					.map(label => {
						if (label.match(fileName)) {
							return {
								label,
								action() {
									//
								},
							}
						}
					})
					.filter(Boolean),
			)
		}
	}

	new CommandPrompt({
		name: 'explorer',
		showInput: true,
		inputDefaultText: currentFileFolder,
		inputPlaceHolder: "Enter a file's path",
		options: [],
		closeOnTab: false,
		onTabPressed: async ({ option, value: itemPath }, { setValue, setOptions }) => {
			let newItemPath
			fs.lstat(itemPath)
				.then(async () => {
					newItemPath = path.join(itemPath, option)
					const info = await fs.lstat(newItemPath)

					if (info.isDirectory()) {
						newItemPath = path.join(newItemPath, '/')
					}
				})
				.catch(async () => {
					const parentFolder = path.dirname(itemPath)
					newItemPath = path.join(parentFolder, option)

					const info = await fs.lstat(newItemPath)

					if (info.isDirectory()) {
						newItemPath = path.join(newItemPath, '/')
					}
				})
				.finally(() => {
					setValue(newItemPath)
					showOptions(newItemPath, setOptions)
				})
		},
		onWriting: async ({ value: itemPath }, { setOptions }) => {
			showOptions(itemPath, setOptions)
		},
		onCompleted: async filePath => {
			const fileExists = await fs.exists(filePath)

			if (fileExists) {
				RunningConfig.emit('loadFile', {
					filePath,
				})
			}
		},
	})
})

const focusCurrentEditor = () => RunningConfig.data.focusedEditor.client.do('doFocus', { instance: RunningConfig.data.focusedEditor.instance })
const currentEditorExists = () => RunningConfig.data.focusedEditor !== null

RunningConfig.on('command.openEditorCommandPrompt', () => {
	new CommandPrompt({
		name: 'editor',
		showInput: true,
		inputPlaceHolder: 'Enter a command',
		options: [
			{
				label: 'Save',
				action: () => {
					if (!currentEditorExists()) return
					focusCurrentEditor()
					RunningConfig.emit('command.saveCurrentFile')
				},
			},
			{
				label: 'Close',
				action: () => {
					if (!currentEditorExists()) return
					focusCurrentEditor()
					RunningConfig.emit('command.closeCurrentTab')
				},
			},
			{
				label: 'Go to line',
				action: () => {
					if (!currentEditorExists()) return
					new CommandPrompt({
						name: 'go_to_line',
						showInput: true,
						inputPlaceHolder: '',
						options: [],
						onCompleted: data => {
							RunningConfig.data.focusedEditor.client.do('setCursorPosition', {
								instance: RunningConfig.data.focusedEditor.instance,
								line: Number(data),
								char: 1,
							})
							focusCurrentEditor()
						},
					})
				},
			},
		],
	})
})

let openedTabsList = []

RunningConfig.on('aTabHasBeenCreated', ({ tabElement }) => {
	openedTabsList.push({
		element: tabElement,
		title: tabElement.state.data.title,
		icon: tabElement.children[0].src,
	})
})

RunningConfig.on('aTabHasBeenClosed', ({ tabElement }) => {
	openedTabsList.splice(getTabIndex(tabElement), 1)
})

const getTabIndex = element => {
	let i = null
	openedTabsList.find((tab, index) => {
		if (tab.element == element) i = index
	})
	return i
}

RunningConfig.on('command.openCurrentPanelTabsIterator', () => {
	if (RunningConfig.data.focusedTab) {
		const focusedTabData = {
			element: RunningConfig.data.focusedTab,
			title: RunningConfig.data.focusedTab.state.data.title,
			icon: RunningConfig.data.focusedTab.children[0].src,
		}

		const focusedTabIndex = getTabIndex(RunningConfig.data.focusedTab)
		openedTabsList.splice(focusedTabIndex, 1)
		openedTabsList.unshift(focusedTabData)

		new CommandPrompt({
			name: 'tab_switcher',
			showInput: false,
			scrollOnTab: true,
			closeOnKeyUp: true,
			defaultOption: openedTabsList.length > 1 ? 1 : 0,
			options: [
				...openedTabsList.map(tab => {
					return {
						icon: tab.icon,
						data: tab.element,
						label: tab.title,
					}
				}),
			],
			onSelected(res) {
				const toFocusTab = openedTabsList.find(tab => {
					return tab.element == res.data
				})
				toFocusTab && toFocusTab.element.state.emit('focusedMe')
			},
		})
	}
})
RunningConfig.on('command.increaseFontSize', ({ factor = 2 } = { factor: 2 }) => {
	StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize) + factor
})
RunningConfig.on('command.decreaseFontSize', ({ factor = 2 } = { factor: 2 }) => {
	StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize) - factor
})
RunningConfig.on('command.closeCurrentWindow', () => {
	const windows = document.getElementById('windows').children
	const selectedWindow = windows[windows.length - 1]
	if (!selectedWindow) return
	const { methods } = selectedWindow.props
	if (windows.length == 0 || !methods) return
	if (methods.closeWindow) methods.closeWindow()
})

RunningConfig.on('command.closeApp', () => {
	RunningConfig.emit('checkAllTabsAreSaved', {
		whenContinue() {
			const electronWindow = remote.getCurrentWindow()
			electronWindow.close()
		},
	})
})

RunningConfig.on('command.focusExplorerPanel', () => {
	if (RunningConfig.data.focusedExplorerItem) {
		//If there is focused item
		RunningConfig.data.focusedExplorerItem.firstChild.focus()
	}
})

const appShortCuts = new Shortcuts()
appShortCuts.add([
	...StaticConfig.data.appShortcuts.SaveCurrentFile.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.saveCurrentFile'),
		}
	}),
	...StaticConfig.data.appShortcuts.NewPanel.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.newPanel'),
		}
	}),
	...StaticConfig.data.appShortcuts.CloseCurrentTab.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.closeCurrentTab'),
		}
	}),
	...StaticConfig.data.appShortcuts.CloseCurrentPanel.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.closeCurrentPanel'),
		}
	}),
	...StaticConfig.data.appShortcuts.OpenEditorCommandPrompt.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.openEditorCommandPrompt'),
		}
	}),
	...StaticConfig.data.appShortcuts.OpenExplorerCommandPrompt.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.openExplorerCommandPrompt'),
		}
	}),
	...StaticConfig.data.appShortcuts.OpenCommandPrompt.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.openCommandPrompt'),
		}
	}),
	...StaticConfig.data.appShortcuts.IterateCurrentPanelTabs.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.openCurrentPanelTabsIterator'),
		}
	}),
	...StaticConfig.data.appShortcuts.IncreaseEditorFontSize.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.increaseFontSize'),
		}
	}),
	...StaticConfig.data.appShortcuts.DecreaseEditorFontSize.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.decreaseFontSize'),
		}
	}),
	...StaticConfig.data.appShortcuts.CloseCurrentWindow.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.closeCurrentWindow'),
		}
	}),
	...StaticConfig.data.appShortcuts.CloseApp.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.closeApp'),
		}
	}),
	...StaticConfig.data.appShortcuts.FocusExplorerPanel.combos.map(shortcut => {
		return {
			shortcut: shortcut,
			handler: event => RunningConfig.emit('command.focusExplorerPanel'),
		}
	}),
])
