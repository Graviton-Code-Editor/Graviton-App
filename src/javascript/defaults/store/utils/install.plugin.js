import path from 'path'
import StaticConfig from 'StaticConfig'
const { ipcRenderer } = window.require('electron')

function installPlugin({ id, release }) {
	return new Promise((resolve, reject) => {
		const pluginsDir = path.join(StaticConfig.data.appConfigPath, 'plugins')
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

export default installPlugin
