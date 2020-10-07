import { state } from '@mkenzo_8/puffin'
import { PuffinState } from 'Types/puffin.state'
import CodemirrorClient from '../defaults/editor.clients/codemirror'
import ImageViewerClient from '../defaults/editor.clients/image.viewer'
import minimist from 'minimist'
import isGitInstalled from './is_git_installed'
const nodeJSONRPC = window.require('node-jsonrpc-lsp')
import electronLog from 'electron-log'
import StaticConfig from 'StaticConfig'

// Get runtime information
const CustomWindow: any = window
const { isDev, processArguments } = CustomWindow.runtime
CustomWindow.runtime = null

// Create logger
if (!isDev) {
	const logger = electronLog.create('graviton')
	logger.transports.file.fileName = 'graviton.log'
	Object.assign(console, logger.functions)
}

const electronArguments = isDev ? processArguments.slice(2) : processArguments.slice(1) || []
const parsedElectronArguments = minimist(electronArguments)
const parsedRendererArguments = isDev ? minimist(process.argv.slice(5)) : minimist(process.argv.slice(1))
const LSPPort = isDev ? 2020 : 2089

const DEFAULT_RUNTIME_CONFIGURATION = {
	windowID: parsedRendererArguments.windowID,
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
	LSPPort,
	LSPServers: {},
	isGitInstalled: false,
	focusedExplorerItem: null,
}

isGitInstalled().then(res => {
	if (res !== RunningConfig.data.isGitInstalled) {
		RunningConfig.data.isGitInstalled = res
	}
})

const RunningConfig: PuffinState = new state(DEFAULT_RUNTIME_CONFIGURATION)

RunningConfig.on('appLoaded', () => {
	if (StaticConfig.data.experimentalEditorLSP) {
		//Experimental
		const lspServer = new nodeJSONRPC({
			port: LSPPort,
			languageServers: {},
		})
		RunningConfig.on('registerLanguageServer', ({ modes, args }) => {
			modes.forEach((name: string) => {
				if (!RunningConfig.data.LSPServers[name]) RunningConfig.data.LSPServers[name] = []
				RunningConfig.data.LSPServers[name].push({
					server: args,
				})
				lspServer.addLanguageServer(name, args)
			})
		})
	}
})

RunningConfig.on('registerEnvironmentInspector', function ({ name, prefix, filter }) {
	RunningConfig.data.envs.push({
		name,
		prefix,
		filter,
	})
})

export default RunningConfig
