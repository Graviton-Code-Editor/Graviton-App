import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import PluginsRegistry from 'PluginsRegistry'
import CursorPositionStatusBarItem from '../defaults/status.bar.items/cursor.position'
import Notification from './notification'
import ContextMenu from './contextmenu'
import path from 'path'
import { element, render, lang } from '@mkenzo_8/puffin'
import { Text, Button } from '@mkenzo_8/puffin-drac'
import { css as style } from '@emotion/css'
import { LanguageState } from 'LanguageConfig'
import { LargeFileLinesLength, LargeFileCharsLength } from 'Constants'
import Core from 'Core'
const { clipboard } = Core

import { EditorOptions } from 'Types/editor'
import { EditorClient } from 'Types/editorclient'
import PuffinElement from 'Types/puffin.element'
import { PuffinEventInstance, PuffinState } from 'Types/puffin.state'

class Editor implements EditorOptions {
	public client: EditorClient
	public instance: any
	public tabElement: PuffinElement
	public savedFileContent: string
	public bodyElement: PuffinElement
	public tabState: PuffinState
	public filePath: string
	public language: string
	public fileName: string
	public options: any
	constructor({ bodyElement, tabElement, value, language, tabState, theme, directory, options = null }) {
		this.language = language
		this.savedFileContent = value
		this.tabElement = tabElement
		this.bodyElement = bodyElement
		this.tabState = tabState
		this.filePath = directory
		this.fileName = directory ? path.basename(directory) : ''
		this.options = options
		this.client = this.getEditorClient()

		if (language === 'exe') {
			this.createCustomClient({
				value,
				theme,
				error: 'This is a binary file.',
			})
		} else if (this.client.type === 'editor' && (value.split('\n').length > LargeFileLinesLength || value.length > LargeFileCharsLength)) {
			this.createCustomClient({
				value,
				theme,
				error: 'This file is too large.',
			})
		} else {
			this.createEditorClient({
				value,
				theme,
			})
		}
	}

	/*
	 * Useful to show messages before opening files
	 */
	private createCustomClient({ value, theme, error }) {
		const self = this

		function accept() {
			containerNode.remove()
			self.createEditorClient({
				value,
				theme,
			})
		}

		const styleWrapper = style`
			display:flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			text-align: center;
		`

		const container = element({
			components: {
				Button,
				Text,
			},
			addons: [lang(LanguageState)],
		})`
			<div class="${styleWrapper}">
				<div>
					<Text>${error}<Text>
					<Button :click="${accept}" lang-string="misc.OpenAnyway"/>
				</div>
			</div>
		`

		this.tabState.emit('focusedMe')

		const containerNode = render(container, this.bodyElement)
	}
	private createEditorClient({ value, theme }) {
		this.bodyElement.setAttribute('client', this.client.name)
		this.instance = this.client.do('create', {
			element: this.bodyElement,
			language: this.client.do('getLangFromExt', {
				extension: this.language,
				fileName: this.fileName,
			}),
			value: value,
			theme: theme,
			directory: this.filePath,
			CtrlPlusScroll: this.handleCtrlPlusScroll.bind(this),
			options: this.options,
		}).instance

		this.updateCursorDisplayer()
		this.focusEditor()
		this.client.do('doFocus', { instance: this.instance })

		if (CursorPositionStatusBarItem.isHidden()) {
			CursorPositionStatusBarItem.show() //Display cursor position item in bottom bar
		}

		this.addListeners()
		this.addClientsListeners()
	}
	private handleCtrlPlusScroll(direction: string): void {
		const ScrollUpShortcutEnabled = StaticConfig.data.appShortcuts.IncreaseEditorFontSize.combos.includes('Ctrl+ScrollUp')
		const ScrollDownShortcutEnabled = StaticConfig.data.appShortcuts.DecreaseEditorFontSize.combos.includes('Ctrl+ScrollDown')
		if (direction === 'up' && ScrollUpShortcutEnabled) {
			StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize) + 2
		} else if (ScrollDownShortcutEnabled) {
			if (StaticConfig.data.editorFontSize <= 4) return
			StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize) - 2
		}
		if (ScrollUpShortcutEnabled || ScrollDownShortcutEnabled) {
			this.client.do('setFontSize', {
				instance: this.instance,
				element: this.bodyElement,
				fontSize: StaticConfig.data.editorFontSize,
			})
		}
	}
	private addListeners(): void {
		const fileWatcher = RunningConfig.on('aFileHasBeenChanged', ({ filePath, newData }) => {
			if (filePath == this.filePath) {
				if (this.client.do('getValue', this.instance) != newData) {
					this.client.do('doChangeValue', {
						instance: this.instance,
						value: newData,
					})
					this.client.do('scrollToCursor', {
						instance: this.instance,
					})
					this.tabState.emit('savedMe')
				}
			}
		})

		const appThemeWatcher = StaticConfig.keyChanged('appTheme', () => {
			this.client.do('setTheme', {
				instance: this.instance,
				theme: PluginsRegistry.registry.data.list[StaticConfig.data.appTheme].textTheme,
			})
		})
		const editorIndentationWatcher = StaticConfig.keyChanged('editorIndentation', (value: string) => {
			this.client.do('setIndentation', {
				instance: this.instance,
				indentation: value,
			})
		})
		const editorTabSizeWatcher = StaticConfig.keyChanged('editorTabSize', (value: number) => {
			this.client.do('setTabSize', {
				instance: this.instance,
				tabSize: value,
			})
		})
		const editorFontSizeWatcher = StaticConfig.keyChanged('editorFontSize', (value: number) => {
			this.client.do('setFontSize', {
				instance: this.instance,
				element: this.bodyElement,
				fontSize: value,
			})
		})
		const editorFontFamilyWatcher = StaticConfig.keyChanged('editorFontFamily', () => {
			this.client.do('refresh', {
				instance: this.instance,
			})
		})
		const editorWrapLinesWatcher = StaticConfig.keyChanged('editorWrapLines', (value: boolean) => {
			if (value) {
				this.client.do('setLinesWrapping', {
					instance: this.instance,
					status: true,
				})
			} else {
				this.client.do('setLinesWrapping', {
					instance: this.instance,
					status: false,
				})
			}
		})
		const tabFocusedWatcher = RunningConfig.on('aTabHasBeenFocused', ({ tabElement }) => {
			if (tabElement !== this.tabElement) return
			this.focusEditor()
			this.updateCursorDisplayer()
			this.client.do('doRefresh', {
				instance: this.instance,
			})
		})
		const tabSavedWatcher = this.tabState.on('savedMe', () => {
			this.savedFileContent = this.client.do('getValue', this.instance)
		})

		const mainboxResizedWatcher = RunningConfig.on('mainBoxHasBeenResized', () => {
			this.client.do('doRefresh', {
				instance: this.instance,
			})
		})

		const editorFoldToggledWatcher = StaticConfig.keyChanged('editorFold', value => {
			this.client.do('toggleFold', {
				instance: this.instance,
				value,
			})
		})

		this.tabState.emit('editorCreated', {
			client: this.client,
			instance: this.instance,
		})

		this.tabState.once('destroyed', () => {
			editorIndentationWatcher.cancel()
			fileWatcher.cancel()
			appThemeWatcher.cancel()
			editorTabSizeWatcher.cancel()
			editorFontSizeWatcher.cancel()
			tabFocusedWatcher.cancel()
			tabSavedWatcher.cancel()
			editorFontFamilyWatcher.cancel()
			editorWrapLinesWatcher.cancel()
			mainboxResizedWatcher.cancel()
			editorFoldToggledWatcher.cancel()
			if (RunningConfig.data.focusedEditor?.instance === this.instance) {
				RunningConfig.data.focusedEditor = null
			}
		})
	}
	private addClientsListeners(): void {
		const getContextMenuDefaultButtons = () => [
			{
				label: 'misc.Copy',
				action: async () => {
					const selectedText = this.client.do('getSelection', {
						instance: this.instance,
						action: () => RunningConfig.emit('hideAllFloatingComps'),
					})

					await clipboard.writeText(selectedText)

					RunningConfig.emit('writeToClipboard', selectedText)

					setTimeout(() => {
						this.client.do('doFocus', {
							instance: this.instance,
						})
					}, 10)
				},
			},
			{
				label: 'misc.Paste',
				action: async () => {
					const { line, ch } = this.client.do('getCursorPosition', {
						instance: this.instance,
					})

					this.client.do('pasteContent', {
						instance: this.instance,
						from: {
							line: line - 1,
							ch: ch - 1,
						},
						text: await clipboard.readText(),
					})

					setTimeout(() => {
						this.client.do('doFocus', {
							instance: this.instance,
						})
					}, 10)
				},
			},
			...(() => {
				if (RunningConfig.data.editorContextMenuButtons.length > 0) {
					return [{}, ...RunningConfig.data.editorContextMenuButtons]
				} else {
					return []
				}
			})(),
		]

		this.client.do('displayContextMenu', {
			instance: this.instance,
			action: ({ event, buttons }) => {
				new ContextMenu({
					parent: document.body,
					list: [...buttons, {}, ...getContextMenuDefaultButtons()],
					event,
				})
			},
		})
		this.client.do('rightclicked', {
			instance: this.instance,
			action: (cm, e: MouseEvent) => {
				new ContextMenu({
					parent: document.body,
					list: getContextMenuDefaultButtons(),
					event: e,
				})
			},
		})
		this.client.do('clicked', {
			instance: this.instance,
			action: () => RunningConfig.emit('hideAllFloatingComps'),
		})
		this.client.do('onChanged', {
			instance: this.instance,
			action: (currentValue: string) => {
				if (currentValue == this.savedFileContent) {
					this.tabElement.state.emit('markAsSaved')
				} else {
					this.tabElement.state.emit('unsavedMe')
				}
			},
		})
		this.client.do('onActive', {
			instance: this.instance,
			action: instance => {
				if (this.tabElement.parentElement) {
					if (RunningConfig.data.focusedEditor == null || RunningConfig.data.focusedEditor.instance != this.instance) this.focusEditor()
					if (RunningConfig.data.focusedPanel != this.tabState.data.panel) RunningConfig.data.focusedPanel = this.tabState.data.panel
					if (RunningConfig.data.focusedTab != this.tabElement) RunningConfig.data.focusedTab = this.tabElement
					if (CursorPositionStatusBarItem.isHidden()) {
						CursorPositionStatusBarItem.show()
					}
					this.updateCursorDisplayer()
				}
			},
		})
	}
	private getEditorClient(): EditorClient {
		let finalEditorClient: EditorClient
		finalEditorClient = RunningConfig.data.editorsRank.find((Client: EditorClient) => {
			return StaticConfig.data.editorsClients.find(({ extension, editor, regex }) => {
				let extensionMatches: string[]
				if (regex) {
					extensionMatches = this.language.match(new RegExp(extension)) || []
				}
				return Client.name === editor && regex && extensionMatches[0]
			})
		})
		if (!finalEditorClient) {
			finalEditorClient = RunningConfig.data.editorsRank.find((Client: EditorClient) => {
				const { unknown = false } = Client.do('getLangFromExt', {
					extension: this.language,
					fileName: this.fileName,
				})
				if (!unknown) return Client
			})
		}
		return finalEditorClient || RunningConfig.data.editorsRank[0]
	}
	private updateCursorDisplayer(): void {
		const { line, ch } = this.client.do('getCursorPosition', {
			instance: this.instance,
		})
		CursorPositionStatusBarItem.setLabel(`Ln ${line}, Ch ${ch}`)
	}
	private focusEditor(): void {
		RunningConfig.data.focusedEditor = {
			client: this.client,
			instance: this.instance,
		}
	}
}

export default Editor
