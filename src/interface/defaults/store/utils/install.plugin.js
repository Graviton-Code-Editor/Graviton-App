import path from 'path'
import StaticConfig from 'StaticConfig'
import { addPluginToRegistry, loadPlugin } from '../../../utils/plugin.loader'
import { pluginsExternalDir } from 'Constants'
const { ipcRenderer } = window.require('electron')

export function installPluginFromURL({ id, release }) {
	return new Promise((resolve, reject) => {
		ipcRenderer
			.invoke('install-plugin', {
				url: release,
				id: id,
				dist: pluginsExternalDir,
			})
			.then(data => {
				const pluginPath = path.join(pluginsExternalDir, id)
				const pluginPkg = addPluginToRegistry(pluginPath)
				loadPlugin(pluginPkg)
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
				dist: pluginsExternalDir,
			})
			.then(data => {
				resolve(data)
			})
	})
}
