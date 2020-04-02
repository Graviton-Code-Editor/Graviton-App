import path from 'path'
import StaticConfig from 'StaticConfig'
const { ipcRenderer } = window.require('electron')

function installPlugin({ id, lastRelease }){
	return new Promise((resolve,reject)=>{
		ipcRenderer.on('plugin-installed', (data)=>{
			resolve(data)
		})
		ipcRenderer.send('download-plugin', {
			url:lastRelease,
			id:id,
			dist:path.join(StaticConfig.data.appConfigPath,'plugins')
		})
	})
}

export default installPlugin