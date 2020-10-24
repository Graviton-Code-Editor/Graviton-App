import Store from 'electron-store'
import { ipcMain, app } from 'electron'
import * as path from 'path'
import { getElectronConfiguration } from './default_config'
import isDev from 'electron-is-dev'

const defaultConfig = getElectronConfiguration(app)

const AppStore = new Store({
	defaults: defaultConfig,
})

ipcMain.on('update-config', (e, config) => {
	AppStore.set('config', config)
})

ipcMain.handle('get-process-arguments', () => {
	return process.argv
})

ipcMain.handle('get-config', () => {
	checkObject(defaultConfig.config, null, AppStore, 0)
	return AppStore.get('config')
})

ipcMain.handle('get-default-config', () => {
	return defaultConfig
})

ipcMain.handle('is-dev', () => {
	return isDev
})

function checkObject(object, subProperty, configurationStore, level) {
	if (level >= 2) return
	Object.keys(object).map(key => {
		let currentLevel = level
		const query = `config${subProperty ? `.${subProperty}` : ''}.${key}`
		if (!configurationStore.has(query)) {
			configurationStore.set(query, object[key])
		}
		const queryValue = object[key]
		if (typeof queryValue == 'object' && !Array.isArray(queryValue)) {
			checkObject(queryValue, key, configurationStore, ++currentLevel)
		}
	})
}

export default AppStore
