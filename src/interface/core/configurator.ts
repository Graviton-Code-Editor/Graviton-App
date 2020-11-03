import Core from 'Core'
const {
	electron: { ipcRenderer },
} = Core
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'

const CustomWindow: any = window

let InitialAppConfig = CustomWindow.AppConfig
let DefaultAppConfig = CustomWindow.DefaultAppConfig

CustomWindow.AppConfig = null
CustomWindow.DefaultAppConfig = null

function getConfiguration() {
	return InitialAppConfig
}

function updateConfiguration(config: any) {
	if (RunningConfig.data.isBrowser) {
		localStorage.setItem('config', JSON.stringify(config))
	} else {
		ipcRenderer.send('update-config', config)
	}
}

async function restartConfiguration() {
	Object.keys(StaticConfig.data).forEach(key => {
		StaticConfig.data[key] = DefaultAppConfig.config[key]
	})
}

export { restartConfiguration, getConfiguration, updateConfiguration }
