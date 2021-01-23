import path from 'path'
import StaticConfig from 'StaticConfig'
import { addPluginToRegistry, loadPlugin } from 'PluginLoader'
import { pluginsInternalDir, pluginsExternalDir } from '../../../utils/plugins_dirs'
import Core from 'Core'
const {
	electron: { ipcRenderer },
} = Core

export function installPluginFromURL({ id, release }) {
	return new Promise((resolve, reject) => {
		ipcRenderer
			.invoke('install-plugin', {
				url: release,
				id: id,
				dist: pluginsExternalDir(),
			})
			.then(data => {
				const pluginPath = path.join(pluginsExternalDir(), id)
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
				dist: pluginsExternalDir(),
			})
			.then(data => {
				resolve(data)
			})
	})
}
