import Core from 'Core'
const {
	electron: { ipcRenderer },
} = Core
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'

const CustomWindow: any = window

const { AppConfig, DefaultAppConfig } = CustomWindow.graviton

CustomWindow.graviton.AppConfig = null
CustomWindow.graviton.DefaultAppConfig = null

function getConfiguration() {
	return AppConfig
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
