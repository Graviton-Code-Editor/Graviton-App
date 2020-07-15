import { state } from '@mkenzo_8/puffin'
import PuffinState from '../types/puffin.state.ts'
import CodemirrorClient from '../defaults/editor.clients/codemirror'
import ImageViewerClient from '../defaults/editor.clients/image.viewer'
const isDev = window.require('electron-is-dev')

const electronArguments = window.require('electron').remote.getCurrentWindow().argv || []
let isDebug = window.require('electron').remote.getCurrentWindow().isDebug
if (isDebug == null) isDebug = true

const nodeJSONRPC = window.require('node-jsonrpc-lsp')

const lspServer = new nodeJSONRPC({
	port: isDev ? 2020 : 2089,
	languageServers: {},
})

let DEFAULT_RUNTIME_CONFIGURATION = {
	focusedPanel: null,
	focusedTab: null,
	focusedEditor: null,
	workspacePath: null,
	iconpack: {},
	isDebug,
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
