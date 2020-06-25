import CodeMirror from 'codemirror'
import emmet from '@emmetio/codemirror-plugin'
import { EditorClient } from '../constructors/editorclient'
import StaticConfig from 'StaticConfig'

import '../../../node_modules/codemirror/mode/**/*.js'

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

const CodemirrorClient = new EditorClient(
	{
		name: 'codemirror',
	},
	{
		getValue: instance => instance.getValue(),
		getLangFromExt(extension) {
			switch (extension) {
				/*
				Every case refers to a programming language's file format, 
				(example: JavaScript -> js). 
				If it's not supported it will go into the default case, 
				bellow yo can see the list of supported by this CodeMirror Client.
				*/
				case 'html':
					return {
						name: 'htmlmixed',
					}
				case 'js':
					return {
						name: 'javascript',
					}
				case 'json':
					return {
						name: 'application/json',
					}
				case 'css':
					return {
						name: 'css',
					}
				case 'php':
					return {
						name: 'php',
					}
				case 'd':
					return {
						name: 'text/x-d',
					}
				case 'rs':
					return {
						name: 'rust',
					}
				case 'rb':
					return {
						name: 'ruby',
					}
				case 'pyw':
				case 'py':
					return {
						name: 'python',
					}
				case 'java':
					return {
						name: 'text/x-java',
					}
				case 'vue':
					return {
						name: 'vue',
					}
				case 'svg':
				case 'xml':
					return {
						name: 'xml',
					}
				case 'ejs':
					return {
						name: 'application/x-ejs',
					}
				case 'yaml':
					return {
						name: 'yaml',
					}
				case 'sql':
					return {
						name: 'sql',
					}
				case 'pug':
					return {
						name: 'pug',
					}
				case 'hpp':
				case 'cpp':
				case 'h':
					return {
						name: 'text/x-c++src',
					}
				case 'c':
					return {
						name: 'text/x-csrc',
					}
				case 'java':
					return {
						name: 'text/x-java',
					}
				case 'scss':
				case 'sass':
					return {
						name: 'text/x-sass',
					}
				case 'php':
					return {
						name: 'application/x-httpd-php',
					}
				case 'md':
				case 'mdx':
					return {
						name: 'gfm',
					}
				case 'tsx':
					return {
						name: 'text/typescript-jsx',
					}
				case 'ts':
					return {
						name: 'text/typescript',
					}
				default:
					return {
						name: extension,
						unknown: true,
					}
			}
		},
		create({ element, language, value, theme, CtrlPlusScroll }) {
			if (language.name == 'htmlmixed') emmet(CodeMirror)
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
				indentWithTabs: true,
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
				},
			})

			CodemirrorEditor.on('keyup', (cm, event, a) => {
				const cmCursor = cm.getDoc().getCursor()
				const cmToken = cm.getTokenAt(cmCursor)
				if (
					StaticConfig.data.editorAutocomplete &&
					cmToken.type &&
					event.metaKey === false &&
					event.altKey === false &&
					event.shiftKey === false &&
					event.ctrlKey === false &&
					event.keyCode > 32 &&
					event.keyCode < 126 &&
					event.keyCode !== 37 &&
					event.keyCode !== 39 &&
					event.keyCode !== 38 &&
					event.keyCode !== 40 &&
					event.keyCode !== 44
				) {
					CodeMirror.commands.autocomplete(cm, null, {
						completeSingle: false,
					})
				}
			})
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
			CodemirrorEditor.refresh()
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
			instance.setOption('indentWithTabs', StaticConfig.data.editorIndentation == 'tab')
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
				}
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
			instance.on('cursorActivity', () => action(instance))
			instance.on('mousedown', () => action(instance))
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
				}
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
	}
)

export default CodemirrorClient
