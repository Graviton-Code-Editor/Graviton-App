const isBrowser = !eval('window.process')
const CustomWindow: any = window
import { getBrowserConfiguration } from '../../app/default_config'

if (isBrowser) {
	import('./browser').then(() => {})
}

/*
 * By default all native dependencies are null, and then loaded dinamically if app is running in the desktop version
 */

const Core = {
	fs: null,
	chokidar: null,
	newMenuItem: null,
	simpleGit: null,
	destroyMenus: null,
	childProcess: null,
	nodeJSONRPC: null,
	electron: null,
	rimraf: null,
	openExternal: null,
}

if (isBrowser) {
	const defaultConfig = getBrowserConfiguration()

	// Load User's configuration from the localStorage
	const storage = localStorage.getItem('config')

	/*
	 * Emulate what the preload script would do in the Desktop app by globally
	 * defining the default config, user's config and runtime info
	 */
	CustomWindow.graviton = {
		AppConfig: storage !== '' && storage !== null ? JSON.parse(storage) : defaultConfig.config,
		DefaultAppConfig: defaultConfig.config,
		runtime: {
			isDev: false,
			processArguments: [],
		},
	}

	Core.electron = {
		shell: {},
		clipboard: null,
		ipcRenderer: null,
	}
	Core.childProcess = {
		exec: null,
	}

	// Use Browser's API to open links
	Core.openExternal = window.open
} else {
	window.require('v8-compile-cache')

	/*
	 * Load native dependencies into the Core module
	 */
	const electron = window.require('electron')
	Core.chokidar = window.require('chokidar')
	Core.fs = window.require('fs-extra')
	Core.simpleGit = window.require('simple-git')
	Core.childProcess = window.require('child_process')
	Core.nodeJSONRPC = window.require('node-jsonrpc-lsp')
	Core.electron = electron
	Core.rimraf = window.require('rimraf')
	Core.openExternal = electron.shell.openExternal
}

export default Core
