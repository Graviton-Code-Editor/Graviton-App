import { ipcMain } from 'electron'
import axios from 'axios'
import * as path from 'path'
import * as fs from 'fs-extra'
import AdmZip from 'adm-zip'

ipcMain.handle('install-plugin', (event, { url, id, dist }) => {
	return new Promise(res => {
		getZip(url, id, dist)
			.then(() => {
				res(true)
			})
			.catch(err => console.log(err))
	})
})

ipcMain.handle('install-gvp', (event, { path: gvpPath, name, dist }) => {
	return new Promise(res => {
		extractZip(gvpPath, name, dist)
			.then(() => {
				res(true)
			})
			.catch(err => console.log(err))
	})
})

function getZip(url, pluginId, dist) {
	return new Promise<void>((resolve, reject) => {
		axios({
			method: 'get',
			url,
			responseType: 'stream',
		}).then(async response => {
			const zipPath = path.join(dist, `${pluginId}.zip`)
			response.data.pipe(fs.createWriteStream(zipPath)).on('close', (a, b) => {
				//Finished download the plugins's zip
				createPluginFolder(pluginId, dist)
				extractZip(zipPath, pluginId, dist)
					.then(() => {
						//Finished unzipping the plugin
						resolve()
					})
					.catch(err => console.log(err))
			})
		})
	})
}

function createPluginFolder(pluginId, dist) {
	const pluginDirectory = path.join(dist, pluginId)
	if (!fs.existsSync(pluginDirectory)) {
		fs.mkdirSync(pluginDirectory)
	}
}

function extractZip(zipPath, pluginId, dist) {
	const pluginDirectory = path.join(dist, pluginId)
	return new Promise<void>((resolve, reject) => {
		const zip = new AdmZip(zipPath)
		zip.extractAllTo(pluginDirectory, true)
		resolve()
	})
}
