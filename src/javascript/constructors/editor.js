import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import PluginsRegistry from 'PluginsRegistry'
import CursorPositionStatusBarItem from '../defaults/status.bar.items/cursor.position'
import Notification from './notification'
import ContextMenu from './contextmenu'
const path = window.require('path')
import { element } from '@mkenzo_8/puffin'
import copy from 'copy-to-clipboard'

function sortByRanking(language) {
	const selectedEditor = RunningConfig.data.editorsRank.filter(Client => {
		const { unknown = false } = Client.do('getLangFromExt', language)
		if (!unknown) return Client
	})[0]
	return selectedEditor || RunningConfig.data.editorsRank[0]
}

function Editor({ bodyElement, tabElement, value, language, tabState, theme, directory }) {
	const Client = sortByRanking(language)
	let editorValueSaved = value
	const { instance } = Client.do('create', {
		element: bodyElement,
		language: Client.do('getLangFromExt', language),
		value,
		theme,
		directory,
		CtrlPlusScroll: direction => {
			const ScrollUpShortcutEnabled = StaticConfig.data.appShortcuts.IncreaseEditorFontSize.combos.includes('Ctrl+ScrollUp')
			const ScrollDownShortcutEnabled = StaticConfig.data.appShortcuts.DecreaseEditorFontSize.combos.includes('Ctrl+ScrollDown')
			if (direction == 'up' && ScrollUpShortcutEnabled) {
				StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize) + 2
			} else if (ScrollDownShortcutEnabled) {
				if (StaticConfig.data.editorFontSize <= 4) return
				StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize) - 2
			}
			if (ScrollUpShortcutEnabled || ScrollDownShortcutEnabled)
				Client.do('setFontSize', {
					instance: instance,
					element: bodyElement,
					fontSize: StaticConfig.data.editorFontSize,
				})
		},
	})
	Client.do('doFocus', { instance })
	const fileWatcher = RunningConfig.on('aFileHasBeenChanged', ({ filePath, newData }) => {
		if (filePath == directory) {
			if (Client.do('getValue', instance) != newData) {
				new Notification({
					title: path.basename(directory),
					content: 'This file content has changed',
					buttons: [
						{
							label: 'Update',
							action() {
								Client.do('doChangeValue', {
									instance: instance,
									value: newData,
								})
							},
						},
					],
				})
			}
		}
	})
	Client.do('rightclicked', {
		instance,
		action(cm, e) {
			e.stopPropagation()
			new ContextMenu({
				parent: document.body,
				list: [
					{
						label: 'misc.Copy',
						action: () => {
							const selectedText = Client.do('getSelection', {
								instance,
								action: () => RunningConfig.emit('hideAllFloatingComps'),
							})
							copy(selectedText)
						},
					},
				],
				event: e,
			})
		},
	})
	Client.do('clicked', {
		instance,
		action: () => RunningConfig.emit('hideAllFloatingComps'),
	})
	Client.do('onChanged', {
		instance: instance,
		action: currentValue => {
			if (currentValue == editorValueSaved) {
				tabElement.state.emit('markAsSaved')
			} else {
				tabElement.state.emit('unsavedMe')
			}
		},
	})
	Client.do('onActive', {
		instance: instance,
		action: instance => {
			if (tabElement.parentElement) {
				if (RunningConfig.data.focusedEditor == null || RunningConfig.data.focusedEditor.instance != instance) focusEditor(Client, instance)
				if (RunningConfig.data.focusedPanel != tabState.data.panel) RunningConfig.data.focusedPanel = tabState.data.panel
				if (RunningConfig.data.focusedTab != tabElement) RunningConfig.data.focusedTab = tabElement
				if (CursorPositionStatusBarItem.isHidden()) {
					CursorPositionStatusBarItem.show()
				}
				updateCursorPosition(Client, instance)
			}
		},
	})
	const appThemeWatcher = StaticConfig.keyChanged('appTheme', function () {
		Client.do('setTheme', {
			instance: instance,
			theme: PluginsRegistry.registry.data.list[StaticConfig.data.appTheme].textTheme,
		})
	})
	const editorIndentationWatcher = StaticConfig.keyChanged('editorIndentation', value => {
		Client.do('setIndentation', {
			instance: instance,
			indentation: value,
		})
	})
	const editorTabSizeWatcher = StaticConfig.keyChanged('editorTabSize', value => {
		Client.do('setTabSize', {
			instance: instance,
			tabSize: value,
		})
	})
	const editorFontSizeWatcher = StaticConfig.keyChanged('editorFontSize', value => {
		Client.do('setFontSize', {
			instance: instance,
			element: bodyElement,
			fontSize: value,
		})
	})
	const editorFontFamilyWatcher = StaticConfig.keyChanged('editorFontFamily', value => {
		Client.do('refresh', {
			instance: instance,
		})
	})
	const focusedEditorWatcher = RunningConfig.keyChanged('focusedEditor', editor => {
		if (editor) {
			CursorPositionStatusBarItem.show()
		} else {
			CursorPositionStatusBarItem.hide()
		}
	})
	const editorWrapLinesWatcher = StaticConfig.keyChanged('editorWrapLines', value => {
		if (value) {
			Client.do('setLinesWrapping', {
				instance,
				status: true,
			})
		} else {
			Client.do('setLinesWrapping', {
				instance,
				status: false,
			})
		}
	})
	const tabFocusedWatcher = tabState.on('focusedMe', () => {
		focusEditor(Client, instance)
		updateCursorPosition(Client, instance)
		Client.do('doRefresh', {
			instance,
		})
	})
	const tabSavedWatcher = tabState.on('savedMe', () => {
		editorValueSaved = Client.do('getValue', instance)
	})
	if (CursorPositionStatusBarItem.isHidden()) {
		CursorPositionStatusBarItem.show() //Display cursor position item in bottom bar
	}
	updateCursorPosition(Client, instance)
	focusEditor(Client, instance)
	tabState.emit('editorCreated', {
		client: Client,
		instance,
	})
	const tabDestroyedWatcher = tabElement.state.on('destroyed', () => {
		fileWatcher.cancel()
		appThemeWatcher.cancel()
		editorTabSizeWatcher.cancel()
		editorFontSizeWatcher.cancel()
		tabFocusedWatcher.cancel()
		focusedEditorWatcher.cancel()
		tabDestroyedWatcher.cancel()
		tabSavedWatcher.cancel()
		editorFontFamilyWatcher.cancel()
	})
	return {
		client: Client,
		instance,
	}
}

function updateCursorPosition(Client, instance) {
	const { line, ch } = Client.do('getCursorPosition', {
		instance,
	})
	CursorPositionStatusBarItem.setLabel(`Ln ${line}, Ch ${ch}`)
}

function focusEditor(Client, instance) {
	RunningConfig.data.focusedEditor = {
		client: Client,
		instance,
	}
}
export default Editor
