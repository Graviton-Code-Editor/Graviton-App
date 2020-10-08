import path from 'path'
import StaticConfig from 'StaticConfig'
const { ipcRenderer } = window.require('electron')

const pluginsDir = path.join(StaticConfig.data.appConfigPath, 'plugins')

export function installPluginFromURL({ id, release }) {
	return new Promise((resolve, reject) => {
		ipcRenderer
			.invoke('install-plugin', {
				url: release,
				id: id,
				dist: pluginsDir,
			})
			.then(data => {
				resolve(data)
			})
	})
}

export function installPluginFromGVP({ path, name }) {
	return new Promise((resolve, reject) => {
		ipcRenderer
			.invoke('install-gvp', {
				path,
				name,
				dist: pluginsDir,
			})
			.then(data => {
				resolve(data)
			})
	})
}
