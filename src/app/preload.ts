import * as path from 'path'
import * as fs from 'fs-extra'
import { ipcRenderer } from 'electron'

const getConfig = () => {
	return ipcRenderer.invoke('get-config')
}

const getDefaultConfig = () => {
	return ipcRenderer.invoke('get-default-config')
}

process.once('loaded', async () => {
	const config = await getConfig()
	let CustomWindow: any = window as any

	CustomWindow.AppConfig = config

	const defaultConfig = await getDefaultConfig()
	CustomWindow.DefaultAppConfig = defaultConfig

	const gravitonConfigPath = config.appConfigPath
	const gravitonPluginsPath = path.join(gravitonConfigPath, 'plugins')

	//If .graviton2 doesn't exist, create it
	if (!fs.existsSync(gravitonConfigPath)) {
		await fs.mkdir(gravitonConfigPath)
	}

	//If .graviton2/plugins doesn't exist, create it
	if (!fs.existsSync(gravitonPluginsPath)) {
		await fs.mkdir(gravitonPluginsPath)
	}
})
