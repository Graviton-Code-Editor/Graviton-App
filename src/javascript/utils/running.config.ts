import { state } from '@mkenzo_8/puffin'
import PuffinState from '../types/puffin.state'
import CodemirrorClient from '../defaults/editor.clients/codemirror'
import ImageViewerClient from '../defaults/editor.clients/image.viewer'
import isDev from 'electron-is-dev'
import { remote } from 'electron'
const nodeJSONRPC = window.require('node-jsonrpc-lsp')

const electronWindow: any = remote.getCurrentWindow()
const electronArguments = electronWindow.argv || []
let windowDebugMode = electronWindow.isDebug
if (windowDebugMode == null) windowDebugMode = true

const lspServer = new nodeJSONRPC({
	port: isDev ? 2020 : 2089,
	languageServers: {},
})

const DEFAULT_RUNTIME_CONFIGURATION = {
	focusedPanel: null,
	focusedTab: null,
	focusedEditor: null,
	workspacePath: null,
	iconpack: {},
	isDebug: windowDebugMode,
	isDev,
	workspaceConfig: {
		name: null,
		folders: [],
	},
	globalCommandPrompt: [],
	notifications: [],
	editorsRank: [CodemirrorClient, ImageViewerClient],
	openedWindows: 0,
	arguments: electronArguments,
	currentStaticConfig: {},
	envs: [],
	projectServices: [],
	languageServers: [],
}

const RunningConfig: PuffinState = new state(DEFAULT_RUNTIME_CONFIGURATION)

RunningConfig.on('registerLanguageServer', ({ modes, args }) => {
	modes.forEach(name => {
		lspServer.addLanguageServer(name, args)
	})
})

console.log(RunningConfig)

export default RunningConfig
