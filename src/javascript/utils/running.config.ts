import { state } from '@mkenzo_8/puffin'
import PuffinState from '../types/puffin.state'
import CodemirrorClient from '../defaults/editor.clients/codemirror'
import ImageViewerClient from '../defaults/editor.clients/image.viewer'
import isDev from 'electron-is-dev'
import { remote } from 'electron'
import minimist from 'minimist'
const nodeJSONRPC = window.require('node-jsonrpc-lsp')

const electronWindow: any = remote.getCurrentWindow()
const electronArguments = remote.process.argv.slice(2) || []
const parsedElectronArguments = minimist(electronArguments)
const parsedRendererArguments = minimist(process.argv.slice(5))

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
	isDebug: parsedRendererArguments.mode === 'debug',
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
	parsedArguments: parsedElectronArguments,
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

export default RunningConfig
