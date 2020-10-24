const isBrowser = !eval('window.process')
const CustomWindow: any = window
import { getBrowserConfiguration } from '../../app/default_config'

if (isBrowser) {
	const defaultConfig = getBrowserConfiguration()

	CustomWindow.runtime = {
		isDev: false,
		processArguments: [],
	}

	const storage = localStorage.getItem('config')

	CustomWindow.AppConfig = storage !== '' && storage !== null ? JSON.parse(storage) : defaultConfig.config
	CustomWindow.DefaultAppConfig = defaultConfig.config
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
}

if (isBrowser) {
	Core.electron = {
		shell: {},
		clipboard: null,
		ipcRenderer: null,
	}
	Core.childProcess = {
		exec: null,
	}
} else {
	window.require('v8-compile-cache')

	/*
	 * Load native dependencies into the Core module
	 */
	Core.chokidar = window.require('chokidar')
	Core.fs = window.require('fs-extra')
	Core.simpleGit = window.require('simple-git')
	Core.childProcess = window.require('child_process')
	Core.nodeJSONRPC = window.require('node-jsonrpc-lsp')
	Core.electron = window.require('electron')
	Core.rimraf = window.require('rimraf')
}

export default Core
