import { state } from '@mkenzo_8/puffin'
import CodemirrorClient from '../defaults/editor.clients/codemirror'
import ImageViewerClient from '../defaults/editor.clients/image.viewer'
import minimist from 'minimist'
import isGitInstalled from '../utils/is_git_installed'
import Core from 'Core'
import StaticConfig from 'StaticConfig'
import { RunningConfigInterface } from 'Types/running_config'
import LocalExplorerProvider from '../defaults/explorer_providers/local'
import RemoteExplorerProvider from '../defaults/explorer_providers/remote'
const { nodeJSONRPC, clipboard } = Core
import isBrowser from '../utils/is_browser'

const DEFAULT_RUNTIME_CONFIGURATION = {
	windowID: null,
	focusedPanel: null,
	focusedTab: null,
	focusedEditor: null,
	workspacePath: null,
	iconpack: {},
	isDebug: false,
	isDev: false,
	workspaceConfig: {
		name: null,
		folders: [],
	},
	globalCommandPrompt: [],
	notifications: [],
	editorsRank: [CodemirrorClient, ImageViewerClient],
	openedWindows: 0,
	arguments: [],
	parsedArguments: [],
	ignoredStaticConfig: {},
	envs: [],
	projectServices: [],
	languageServers: [],
	LSPPort: null,
	LSPServers: {},
	isGitInstalled: false,
	focusedExplorerItem: null,
	terminalShells: [],
	openedTerminals: [],
	focusedTerminal: null,
	localTerminalAccessories: [],
	isBrowser,
	registeredExplorerProviders: isBrowser ? [RemoteExplorerProvider] : [LocalExplorerProvider],
	explorerProvider: isBrowser ? RemoteExplorerProvider : LocalExplorerProvider,
	editorContextMenuButtons: [],
}

isGitInstalled().then(res => {
	if (res !== RunningConfig.data.isGitInstalled) {
		RunningConfig.data.isGitInstalled = res
	}
})

const RunningConfig: RunningConfigInterface = new state(DEFAULT_RUNTIME_CONFIGURATION)

window.addEventListener('load', () => {
	/*
	 * Get runtime information
	 */
	const CustomWindow: any = window
	const { isDev, processArguments } = CustomWindow.graviton.runtime
	const electronArguments = isDev ? processArguments.slice(2) : processArguments.slice(1) || []
	const parsedElectronArguments = isBrowser ? [] : minimist(electronArguments)
	const parsedRendererArguments = isBrowser ? [] : isDev ? minimist(process.argv.slice(5)) : minimist(process.argv.slice(1))
	const LSPPort = isDev ? 2020 : 2089
	CustomWindow.graviton.runtime = null

	/*
	 * Dinamically assign runtime information in RunningConfig
	 */
	RunningConfig.data.arguments = electronArguments
	RunningConfig.data.parsedArguments = parsedElectronArguments
	RunningConfig.data.isDev = isDev
	RunningConfig.data.windowID = parsedRendererArguments.windowID
	RunningConfig.data.isDebug = parsedRendererArguments.mode === 'debug'
	RunningConfig.data.LSPPort = LSPPort

	/*
	 * Create a console logger in production, this saves all logs, errors, warnings,etc...
	 */
	if (!isDev && !isBrowser) {
		const electronLog = window.require('electron-log')
		const logger = electronLog.create('graviton')
		logger.transports.file.fileName = 'graviton.log'
		Object.assign(console, logger.functions)
	}

	/*
	 * Create a server for LSP and allow to register all language servers if 'experimentalEditorLSP' is enabled
	 */
	if (StaticConfig.data.experimentalEditorLSP) {
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

/*
 * Simulate the copy event
 */
RunningConfig.on('writeToClipboard', async function (text) {
	await clipboard.writeText(text)
	RunningConfig.emit('clipboardHasBeenWritten', {
		text,
	})
})

/*
 * Write to the the user's clipboard
 */
RunningConfig.on('writeToClipboardSilently', async function (text) {
	await clipboard.writeText(text)
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

/*
 * Safely load a explorer provider
 * Default is the Local Explorer Provider
 */
RunningConfig.on('registerExplorerProvider', function (provider) {
	RunningConfig.data.registeredExplorerProviders.push(provider)
})

/*
 * Safely create a command
 */
RunningConfig.on('registerCommand', ({ name, shortcut, action }) => {
	RunningConfig.data.globalCommandPrompt.push({
		label: name,
		action,
	})
})

export default RunningConfig
