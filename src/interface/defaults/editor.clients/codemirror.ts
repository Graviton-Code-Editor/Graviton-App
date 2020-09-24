import CodeMirror from 'codemirror'
import emmet from '@emmetio/codemirror-plugin'
import { state } from '@mkenzo_8/puffin'
import { EditorClient } from '../../constructors/editorclient'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'

import 'lsp-codemirror/lib/codemirror-lsp.css'
import 'lsp-codemirror/lib/icons/rect.svg'

import { LspWsConnection, CodeMirrorAdapter } from 'lsp-codemirror'

import 'codemirror/addon/search/search'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/sql-hint'
import 'codemirror/addon/hint/xml-hint'
import 'codemirror/addon/hint/html-hint'

const path = window.require('path')

/*
	This is the editor client used to edit plain text files
*/

const CodemirrorClient = new EditorClient(
	{
		name: 'codemirror',
		type: 'editor',
	},
	{
		getValue: instance => instance.getValue(),
		getLangFromExt({ extension }) {
			switch (extension) {
				/*
				Every case refers to a programming language's file format, 
				(example: JavaScript -> js). 
				If it's not supported it will go into the default case, 
				bellow yo can see the list of supported by this CodeMirror Client.
				*/
				case 'html':
					return {
						fancy: 'html',
						mode: 'html',
						name: 'htmlmixed',
					}
				case 'jsx':
					return {
						fancy: 'jsx',
						mode: 'javascript',
						name: 'text/jsx',
					}
				case 'gjs':
					return {
						fancy: 'gjs',
						mode: 'javascript',
						name: 'text/javascript',
					}
				case 'js':
					return {
						fancy: 'javascript',
						mode: 'javascript',
						name: 'text/jsx',
					}
				case 'json':
					return {
						fancy: 'json',
						mode: 'json',
						name: 'application/json',
					}
				case 'css':
					return {
						fancy: 'cs',
						mode: 'css',
						name: 'css',
					}
				case 'php':
					return {
						fancy: 'php',
						mode: 'php',
						name: 'php',
					}
				case 'dart':
					return {
						fancy: 'dart',
						mode: 'dart',
						name: 'dart',
					}
				case 'd':
					return {
						fancy: 'd',
						mode: 'd',
						name: 'text/x-d',
					}
				case 'rs':
					return {
						fancy: 'rust',
						mode: 'rust',
						name: 'rust',
					}
				case 'rb':
					return {
						name: 'ruby',
					}
				case 'pyw':
				case 'py':
					return {
						fancy: 'python',
						mode: 'python',
						name: 'python',
					}
				case 'svelte':
					return {
						fancy: 'svelte',
						mode: 'svelte',
						name: 'text/x-vue',
					}
				case 'vue':
					return {
						fancy: 'vue',
						mode: 'vue',
						name: 'text/x-vue',
					}
				case 'svg':
				case 'xml':
					return {
						fancy: 'xml',
						mode: 'xml',
						name: 'xml',
					}
				case 'ejs':
					return {
						fancy: 'ejs',
						mode: 'javascript',
						name: 'application/x-ejs',
					}
				case 'lua':
					return {
						fancy: 'lua',
						mode: 'lua',
						name: 'text/x-lua',
					}
				case 'yml':
				case 'yaml':
					return {
						fancy: 'yaml',
						mode: 'yaml',
						name: 'yaml',
					}
				case 'sql':
					return {
						fancy: 'sql',
						mode: 'sql',
						name: 'sql',
					}
				case 'pug':
					return {
						fancy: 'pug',
						mode: 'pug',
						name: 'pug',
					}
				case 'hpp':
				case 'cpp':
				case 'h':
					return {
						fancy: 'cpp',
						mode: 'cpp',
						name: 'text/x-c++src',
					}
				case 'c':
					return {
						fancy: 'c',
						mode: 'c',
						name: 'text/x-csrc',
					}
				case 'java':
					return {
						fancy: 'java',
						mode: 'java',
						name: 'text/x-java',
					}
				case 'scss':
					return {
						fancy: 'sass',
						mode: 'sass',
						name: 'text/x-scss',
					}
				case 'sass':
					return {
						fancy: 'sass',
						mode: 'sass',
						name: 'text/x-sass',
					}
				case 'php':
					return {
						fancy: 'php',
						mode: 'php',
						name: 'application/x-httpd-php',
					}
				case 'md':
				case 'mdx':
					return {
						fancy: 'markdown',
						mode: 'markdown',
						name: 'gfm',
					}
				case 'tsx':
					return {
						fancy: 'tsx',
						mode: 'typescript',
						name: 'text/typescript-jsx',
					}
				case 'ts':
					return {
						fancy: 'typescript',
						mode: 'typescript',
						name: 'text/typescript',
					}
				case 'sh':
					return {
						fancy: 'shell',
						mode: 'shell',
						name: 'text/x-sh',
					}
				case 'less':
					return {
						fancy: 'less',
						mode: 'less',
						name: 'text/x-less',
					}
				case 'fs':
					return {
						fancy: 'fs',
						mode: 'fs',
						name: 'text/x-fsharp',
					}
				case 'slim':
					return {
						fancy: 'slim',
						mode: 'slim',
						name: 'application/x-slim',
					}
				case 'go':
					return {
						fancy: 'golang',
						mode: 'go',
						name: 'text/x-go',
					}
				default:
					return {
						name: extension,
						unknown: true,
					}
			}
		},
		create({ element, language, value, theme, CtrlPlusScroll, directory }) {
			emmet(CodeMirror)
			const CodemirrorEditor = CodeMirror(element, {
				mode: language,
				value: value,
				lineNumbers: true,
				htmlMode: true,
				styleActiveLine: {
					nonEmpty: true,
				},
				styleActiveSelected: true,
				matchTags: {
					bothTags: true,
				},
				autoCloseTags: true,
				autoCloseBrackets: true,
				matchBrackets: true,
				theme: theme,
				tabSize: StaticConfig.data.editorTabSize,
				indentUnit: StaticConfig.data.editorTabSize,
				undoDepth: 500,
				miniMap: false,
				indentWithTabs: StaticConfig.data.editorIndentation == 'tab',
				lineWrapping: StaticConfig.data.editorWrapLines,
				extraKeys: {
					Tab: 'emmetExpandAbbreviation',
					Esc: 'emmetResetAbbreviation',
					Enter: 'emmetInsertLineBreak',
				},
				emmet: {
					preview: false,
					mark: true,
					markTagPairs: true,
					previewOpenTag: false,
					config: {
						markup: {
							snippets: {
								'foo': 'ul.nav>li'
							}
						}
					}
				},
				gutters: ['CodeMirror-lsp'],
			})
			CodemirrorEditor.pstate = new state({})
			element.getElementsByClassName('Codemirror')[0].style.fontSize = StaticConfig.data.editorFontSize
			const CtrlUpShortcutEnabled = StaticConfig.data.appShortcuts.IncreaseEditorFontSize.combos.includes('Ctrl+Up')
			const CtrlDownShortcutEnabled = StaticConfig.data.appShortcuts.DecreaseEditorFontSize.combos.includes('Ctrl+Down')
			if (CtrlUpShortcutEnabled) {
				CodemirrorEditor.addKeyMap({
					'Ctrl-Up': function (instance) {
						CtrlPlusScroll('up')
					},
				})
			}
			if (CtrlDownShortcutEnabled) {
				CodemirrorEditor.addKeyMap({
					'Ctrl-Down': function (instance) {
						CtrlPlusScroll('down')
					},
				})
			}
			element.addEventListener('wheel', e => {
				if (!e.ctrlKey) return
				if (e.wheelDeltaY.toString()[0] == '-') {
					CtrlPlusScroll('down')
				} else {
					CtrlPlusScroll('up')
				}
			})
			CodemirrorEditor.on('keyup', (cm, event: KeyboardEvent) => {
				event.preventDefault()
			})
			CodemirrorEditor.refresh()
			let lspServer: string
			let lspAdapter
			let lspConnection
			Object.keys(RunningConfig.data.LSPServers).forEach(server => {
				if (server == language.mode) {
					lspServer = `ws://localhost:${RunningConfig.data.LSPPort}/${server}`
				}
			})
			if (lspServer && StaticConfig.data.editorAutocomplete) {
				const lspClient = createLspClient({
					lspServer,
					language,
					directory,
					CodemirrorEditor,
				})
				lspAdapter = lspClient.lspAdapter
				lspConnection = lspClient.lspConnection
			}

			StaticConfig.keyChanged('editorAutocomplete', (value: string) => {
				if (value) {
					const lspClient = createLspClient({
						lspServer,
						language,
						directory,
						CodemirrorEditor,
					})
					lspAdapter = lspClient.lspAdapter
					lspConnection = lspClient.lspConnection
				} else {
					lspAdapter.remove()
					lspConnection.close()
					lspAdapter = null
					lspConnection = null
				}
			})

			handleCMAutocomplete(CodemirrorEditor, language)

			return {
				instance: CodemirrorEditor,
			}
		},
		getMode({ instance }) {
			return instance.getOption('mode')
		},
		getLinesCount({ instance }) {
			return instance.lineCount()
		},
		getSelection({ instance }) {
			return instance.getSelection()
		},
		setIndentation({ instance, indentation }) {
			instance.setOption('indentWithTabs', indentation === 'tab')
		},
		doRefresh({ instance }) {
			setTimeout(function () {
				instance.focus()
				instance.refresh()
			}, 1)
		},
		rightclicked({ instance, action }) {
			instance.on('contextmenu', action)
		},
		clicked({ instance, action }) {
			instance.on('mousedown', action)
		},
		doIndent({ instance }) {
			const cursorPos = instance.getCursor()
			instance.extendSelection(
				{ line: 0, ch: 0 },
				{
					line: instance.lineCount(),
				},
			)
			instance.execCommand('indentAuto')
			instance.setCursor(cursorPos)
			instance.refresh()
		},
		doChangeValue({ instance, value }) {
			instance.setValue(value)
		},
		onChanged({ instance, action }) {
			instance.on('change', (cm, changeObj) => action(instance.getValue(), changeObj))
		},
		replaceRange({ instance, from, to, text }) {
			instance.replaceRange(text, from, to, '+move')
		},
		getRange({ instance, from, to }) {
			return instance.getRange(from, to)
		},
		getLine({ instance, line }) {
			return instance.getLine(line)
		},
		executeUndo({ instance, action }) {
			instance.execCommand('undo')
		},
		executeRedo({ instance, action }) {
			instance.execCommand('redo')
		},
		onActive({ instance, action }) {
			instance.on('cursorActivity', action)
		},
		openFind({ instance }) {
			instance.execCommand('find')
		},
		openReplace({ instance }) {
			instance.execCommand('replace')
		},
		setTheme({ instance, theme }) {
			instance.setOption('theme', theme)
		},
		setTabSize({ instance, tabSize }) {
			instance.setOption('tabSize', tabSize)
			instance.setOption('indentUnit', tabSize)
			instance.refresh()
		},
		setFontSize({ instance, element, fontSize }) {
			element.getElementsByClassName('Codemirror')[0].style.fontSize = fontSize
			instance.refresh()
			instance.scrollIntoView()
		},
		getCursorPosition({ instance }) {
			const { line, ch } = instance.getCursor()
			return {
				line: line + 1,
				ch: ch + 1,
			}
		},
		setBookmark({ instance, line, ch, element }) {
			const bookmark = instance.setBookmark(
				{
					line,
					ch,
				},
				{
					widget: element,
				},
			)
			const clear = () => bookmark.clear()
			return {
				clear,
			}
		},
		setCursorPosition({ instance, line = 1, ch = 1 }) {
			instance.setCursor({
				line: Number(line) - 1,
				ch: Number(ch) - 1,
			})
		},
		doFocus({ instance }) {
			instance.focus()
		},
		scrollToCursor({ instance }) {
			instance.scrollIntoView()
		},
		setLinesWrapping({ instance, status }) {
			instance.setOption('lineWrapping', status)
			instance.refresh()
			instance.scrollIntoView()
		},
		displayContextMenu({ instance, action }) {
			instance.pstate.on('displayContextMenu', action)
		},
	},
)

function createLspClient({ lspServer, language, directory, CodemirrorEditor }) {
	const fileUri = directory.replace(/\\/gm, '/')
	const folderUrl = path.dirname(fileUri)
	const lspConnection = new LspWsConnection({
		serverUri: lspServer,
		languageId: language.fancy,
		rootUri: `file:///${folderUrl.replace(/\/\//gm, '/')}`,
		documentUri: `file:///${fileUri.replace(/\/\//gm, '/')}`,
		documentText: () => CodemirrorEditor.getValue(),
	}).connect(new WebSocket(lspServer))

	const lspAdapter = new CodeMirrorAdapter(
		lspConnection,
		{
			quickSuggestionsDelay: 40,
			contextMenuProvider(event, buttons) {
				CodemirrorEditor.pstate.emit('displayContextMenu', { event, buttons })
			},
		},
		CodemirrorEditor,
	)

	return {
		lspConnection,
		lspAdapter,
	}
}

function handleCMAutocomplete(CodemirrorEditor, { fancy }): void {
	if (fancy === 'html') {
		CodemirrorEditor.on('change', (cm, change) => {
			const location = CodemirrorEditor.getDoc().getCursor('end')
			const line = CodemirrorEditor.getLine(location.line)
			const typedCharacter = line[location.ch - 1]
			if (typedCharacter == '<') {
				CodeMirror.commands.autocomplete(CodemirrorEditor, null, {
					completeSingle: false,
				})
			}
		})
	}
}

export default CodemirrorClient
