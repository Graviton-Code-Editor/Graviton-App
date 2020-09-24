import path from 'path'
import StaticConfig from 'StaticConfig'
const { ipcRenderer } = window.require('electron')

const pluginsDir = path.join(StaticConfig.data.appConfigPath, 'plugins')

export function installPluginFromURL({ id, release }) {
	return new Promise((resolve, reject) => {
		ipcRenderer.on('plugin-installed', data => {
			resolve(data)
		})
		ipcRenderer.send('download-plugin', {
			url: release,
			id: id,
			dist: pluginsDir,
		})
	})
}

export function installPluginFromGVP({ path, name }) {
	return new Promise((resolve, reject) => {
		ipcRenderer.on('gvp-installed', data => {
			resolve(data)
		})
		ipcRenderer.send('install-gvp', {
			path,
			name,
			dist: pluginsDir,
		})
	})
}
