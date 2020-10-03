import { ipcRenderer } from 'electron'
import StaticConfig from 'StaticConfig'

const CustomWindow: any = window

let InitialAppConfig = CustomWindow.AppConfig
let DefaultAppConfig = CustomWindow.DefaultAppConfig

CustomWindow.AppConfig = null
CustomWindow.DefaultAppConfig = null

function getConfiguration() {
	return InitialAppConfig
}

function updateConfiguration(config: any) {
	ipcRenderer.send('update-config', config)
}

async function restartConfiguration() {
	Object.keys(StaticConfig.data).forEach(key => {
		StaticConfig.data[key] = DefaultAppConfig.config[key]
	})
}

export { restartConfiguration, getConfiguration, updateConfiguration }
