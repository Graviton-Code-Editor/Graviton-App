import path from 'path'
import fs from 'fs-extra'
import { ipcRenderer } from 'electron'
import StaticConfig from 'StaticConfig'

let InitialAppConfig = window.AppConfig
let DefaultAppConfig = window.DefaultAppConfig

window.AppConfig = null
window.DefaultAppConfig = null

function getConfiguration() {
	return InitialAppConfig
}

function updateConfiguration(config) {
	ipcRenderer.send('update-config', config)
}

async function restartConfiguration() {
	Object.keys(StaticConfig.data).forEach(key => {
		StaticConfig.data[key] = DefaultAppConfig.config[key]
	})
}

export { restartConfiguration, getConfiguration, updateConfiguration }
