import { state } from '@mkenzo_8/puffin'
import { PuffinState } from 'Types/puffin.state'
import CodemirrorClient from '../defaults/editor.clients/codemirror'
import ImageViewerClient from '../defaults/editor.clients/image.viewer'
import minimist from 'minimist'
import isGitInstalled from '../utils/is_git_installed'
import Core from 'Core'
import StaticConfig from 'StaticConfig'
import RunningConfigInterface from 'Types/running_config'
const {
	nodeJSONRPC,
	electron: { clipboard },
} = Core
import isBrowser from '../utils/is_browser'

// Get runtime information
const CustomWindow: any = window
const { isDev, processArguments } = CustomWindow.graviton.runtime
CustomWindow.graviton.runtime = null

/*
 * Create a console logger in production, this saves all logs, errors, warnings,etc...
 */
if (!isDev && !isBrowser) {
	const electronLog = window.require('electron-log')
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
	ignoredStaticConfig: {},
	envs: [],
	projectServices: [],
	languageServers: [],
	LSPPort,
	LSPServers: {},
	isGitInstalled: false,
	focusedExplorerItem: null,
	terminalShells: [],
	openedTerminals: [],
	focusedTerminal: null,
	localTerminalAccessories: [],
	isBrowser,
}

isGitInstalled().then(res => {
	if (res !== RunningConfig.data.isGitInstalled) {
		RunningConfig.data.isGitInstalled = res
	}
})

const RunningConfig: RunningConfigInterface = new state(DEFAULT_RUNTIME_CONFIGURATION)

/*
 * Allow to register all language servers if 'experimentalEditorLSP' is enabled
 */
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
	if (isDev) {
		CustomWindow.s = StaticConfig
	}
})

/*
 * Simulate the copy event
 */
RunningConfig.on('writeToClipboard', function (text) {
	clipboard.writeText(text)
	RunningConfig.emit('clipboardHasBeenWritten', {
		text,
	})
})

/*
 * Write to the the user's clipboard
 */
RunningConfig.on('writeToClipboardSilently', function (text) {
	clipboard.writeText(text)
})

/*
 * Register Environments inspectors
 */
RunningConfig.on('registerEnvironmentInspector', function ({ name, prefix, filter }) {
	RunningConfig.data.envs.push({
		name,
		prefix,
		filter,
	})
})

/*
 * Register Editor Clients into the Editors Rank
 */
RunningConfig.on('registerEditorClient', function (editorClient) {
	RunningConfig.data.editorsRank.push(editorClient)
})

if (isDev) {
	/*
	 * Export RunningConfig as a global object in development mode
	 */
	CustomWindow.r = RunningConfig
}

export default RunningConfig
