import CodeMirror from 'codemirror'
import emmet from '@emmetio/codemirror-plugin'
import { state } from '@mkenzo_8/puffin'
import { EditorClient } from '../../constructors/editorclient'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import isBrowser from '../../utils/is_browser'
import path from 'path'
import DiffMatchPatch from 'diff-match-patch'
import CodeMirrorOptions from 'Types/codemirror_client'
import 'lsp-codemirror/lib/codemirror-lsp.css'
import 'lsp-codemirror/lib/icons/rect.svg'

let LspWsConnection
let CodeMirrorAdapter

if (!isBrowser) {
	let CustomWindow: any = window

	// CodeMirror Merge Addon needs these defined globally
	CustomWindow.diff_match_patch = DiffMatchPatch
	CustomWindow.DIFF_EQUAL = 0
	CustomWindow.DIFF_INSERT = 1
	CustomWindow.DIFF_DELETE = -1

	import('lsp-codemirror').then(lspCodemirror => {
		LspWsConnection = lspCodemirror.LspWsConnection
		CodeMirrorAdapter = lspCodemirror.CodeMirrorAdapter
	})
}

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
		getLangFromExt({ extension, fileName }) {
			switch (fileName) {
				case '.babelrc':
					return {
						fancy: 'json',
						mode: 'json',
						name: 'application/json',
					}
			}

			const lowerCasedExtension = extension.toLowerCase()

			/*
			 * Every case refers to a programming language's file format,
			 * (example: JavaScript -> js).
			 * If it's not supported it will go into the default case,
			 * below yo can see the list of supported by this CodeMirror Client.
			 */
			switch (lowerCasedExtension) {
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
				case 'jade':
					return {
						fancy: 'jade',
						mode: 'jade',
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
				case 'b':
				case 'bf':
					return {
						fancy: 'Brainfuck',
						mode: 'brainfuck',
						name: 'text/x-brainfuck',
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
				case 'cs':
					return {
						fancy: 'C#',
						mode: 'csharp',
						name: 'text/x-csharp',
					}
				case 'hs':
					return {
						fancy: 'Haskell',
						mode: 'text/x-haskell',
						name: 'text/x-haskell',
					}
				default:
					return {
						name: extension,
						unknown: true,
					}
			}
		},
		create({ element, language, value, theme, CtrlPlusScroll, directory, options = {} }: CodeMirrorOptions) {
			let CodeMirrorClient = CodeMirror
			let extraOptions = {}

			/*
			 * Only when is in merge mode is enabled use CodeMirror's MergeView to create the instance
			 */
			if (options?.merge) {
				CodeMirrorClient = CodeMirror.MergeView
				extraOptions = {
					origRight: options.mirror,
					orig: value,
					highlightDifferences: true,
					conntect: 'align',
				}
			}

			emmet(CodeMirror)

			let CodemirrorEditor = CodeMirrorClient(element, {
				mode: language,
				value: value,
				...extraOptions,
				collpse: false,
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
				indentWithTabs: language.name === 'yaml' ? false : StaticConfig.data.editorIndentation == 'tab',
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
					config: {},
				},
				foldGutter: StaticConfig.data.editorFold,
				foldOptions: {
					widget: (from, to) => {
						return ' ··· '
					},
				},
				gutters: ['CodeMirror-lsp', 'CodeMirror-foldgutter'],
			})

			/*
			 * Only when is in merge mode is enabled
			 */
			if (options?.merge) {
				setTimeout(() => {
					// Wait 250ms for lines to be rendered
					highlightModifiedLines()
				}, 250)

				const { edit, right } = CodemirrorEditor

				// Update lines on changes
				edit.on('changes', () => {
					setTimeout(() => {
						highlightModifiedLines()
					}, 250)
				})

				// Update lines when scrolling
				edit.on('scroll', () => {
					highlightModifiedLines()
				})

				edit.on('optionChange', (cm, option) => {
					right.orig.setOption(option, edit.getOption(option))
					right.orig.refresh()
				})

				edit.on('refresh', () => {
					right.orig.refresh()
					setTimeout(() => {
						highlightModifiedLines()
					}, 300)
				})
				;[edit, right.orig].forEach(cm => {
					// Update lines on cursor activity on both instances
					cm.on('cursorActivity', () => {
						setTimeout(() => {
							highlightModifiedLines()
						}, 1)
					})
				})

				// Reassign the primary CodemirrorEditor to the CM instance
				CodemirrorEditor = edit
			}

			/*
			 * Send a event of clipboard been written on Ctrl+C
			 */
			CodemirrorEditor.on('keydown', (cm, ev) => {
				if (ev.code === 'KeyC' && ev.ctrlKey) {
					RunningConfig.emit('clipboardHasBeenWritten', {
						text: CodemirrorEditor.getSelection(),
					})
				}
			})

			/*
			 * Force every CodeMirror instance inside the editor container to have the configured font size
			 */
			const editors = element.getElementsByClassName('Codemirror')
			Object.keys(editors).forEach(cm => {
				editors[cm].style.fontSize = StaticConfig.data.editorFontSize
			})

			const CtrlUpShortcutEnabled = StaticConfig.data.appShortcuts.IncreaseEditorFontSize.combos.includes('Ctrl+Up')
			const CtrlDownShortcutEnabled = StaticConfig.data.appShortcuts.DecreaseEditorFontSize.combos.includes('Ctrl+Down')

			/*
			 * Ctrl+ArrowUp handler
			 */
			if (CtrlUpShortcutEnabled) {
				CodemirrorEditor.addKeyMap({
					'Ctrl-Up': function (instance) {
						CtrlPlusScroll('up')
					},
				})
			}
			/*
			 * Ctrl+ArrowDown handler
			 */
			if (CtrlDownShortcutEnabled) {
				CodemirrorEditor.addKeyMap({
					'Ctrl-Down': function (instance) {
						CtrlPlusScroll('down')
					},
				})
			}

			// Ctrl+wheel event handler
			if (!RunningConfig.data.isBrowser) {
				element.addEventListener('wheel', (e: any) => {
					if (!e.ctrlKey) return
					if (e.wheelDeltaY.toString()[0] == '-') {
						CtrlPlusScroll('down')
					} else {
						CtrlPlusScroll('up')
					}
				})
			}

			//Prevent default action of 'keyup' so codemirror doesn't go 1 line up when scrolling on context menus with arrows
			CodemirrorEditor.on('keyup', (cm, event: KeyboardEvent) => {
				event.preventDefault()
			})

			let lspServer: string
			let lspAdapter
			let lspConnection

			//Find the first language server that matches the current file's language
			Object.keys(RunningConfig.data.LSPServers).forEach(server => {
				if (server == language.mode) {
					lspServer = `ws://localhost:${RunningConfig.data.LSPPort}/${server}`
				}
			})

			//Create LSP Client if LSP is enabled
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

			//Enable or disable the LSP client if autocompleting is toggled
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
					if (lspAdapter) lspAdapter.remove()
					if (lspConnection) lspConnection.close()
					lspAdapter = null
					lspConnection = null
				}
			})

			//Assign a puffin state to the CodeMirror instance
			CodemirrorEditor.pstate = new state({})

			CodemirrorEditor.pstate.once('close', () => {
				if (lspConnection) lspConnection.close()
			})

			CodemirrorEditor.refresh()

			handleCMAutocomplete(CodemirrorEditor, language)

			return {
				instance: CodemirrorEditor,
			}
		},
		close({ instance }) {
			instance.pstate.emit('close')
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
		pasteContent({ instance, from, text }) {
			instance.replaceRange(text, from)
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
			const editors = element.getElementsByClassName('Codemirror')
			Object.keys(editors).forEach(cm => {
				editors[cm].style.fontSize = fontSize
			})
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
		blur({ instance }) {
			setTimeout(() => {
				instance.getInputField().blur()
			}, 1)
		},
		toggleFold({ instance, value }) {
			instance.setOption('foldGutter', value)
		},
	},
)

/*
 * Create a LSP adapter client into a CodeMirror instance
 */
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

/*
 * Handle CodeMirro's built-in autocomplete
 */
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

/*
 * Append a custom class to every inserted or deleted character's parent
 */
function highlightModifiedLines(): void {
	let pastLine = null

	//Update inserted lines
	for (const char of document.getElementsByClassName('CodeMirror-merge-r-inserted') as any) {
		const line = char.parentElement.parentElement
		if (pastLine !== line) line.classList.add('CodeMirror-merge-line-inserted')
		pastLine = line
	}

	//Update removed lines
	for (const char of document.getElementsByClassName('CodeMirror-merge-r-deleted') as any) {
		const line = char.parentElement.parentElement
		if (pastLine !== line) line.classList.add('CodeMirror-merge-line-deleted')
		pastLine = line
	}
}

export default CodemirrorClient
