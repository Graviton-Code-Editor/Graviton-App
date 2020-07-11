import { state } from '@mkenzo_8/puffin'
import CodemirrorClient from '../defaults/codemirror.client'
import ImageViewerClient from '../defaults/imageviewer.client'
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

const RunningConfig = new state(DEFAULT_RUNTIME_CONFIGURATION)

RunningConfig.on('registerLanguageServer', ({ name, args }) => {
	console.log(name, args)
	lspServer.addLanguageServer(name, args)
})

console.log(RunningConfig)

export default RunningConfig
