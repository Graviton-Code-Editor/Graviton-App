import Store from 'electron-store'
import { ipcMain, app } from 'electron'
import * as path from 'path'
import getDefaultConfiguration from './default_config'

const AppStore = new Store()
const defaultConfig = getDefaultConfiguration(app)

ipcMain.on('update-config', (e, config) => {
	AppStore.set('config', config)
})

ipcMain.handle('get-config', () => {
	checkObject(defaultConfig.config, null, AppStore, 0)
	return AppStore.get('config')
})

ipcMain.handle('get-default-config', () => {
	return defaultConfig
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
