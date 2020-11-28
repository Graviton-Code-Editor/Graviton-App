import EnvClient from '../constructors/env_client'
import Core from 'Core'
const {
	electron: { ipcRenderer },
} = Core
import RunningConfig from 'RunningConfig'

function openDebugClient() {
	const windowID = Math.random()
	let created = false

	const debugClient = new EnvClient({
		name: 'Debug Window',
	})

	debugClient.on('start', () => {
		if (!created) {
			ipcRenderer.invoke('create-debug-window', windowID)
			created = true
		}
	})
	debugClient.on('reload', () => {
		ipcRenderer.invoke('reload-debug-window', windowID)
	})
	debugClient.on('stop', () => {
		ipcRenderer.invoke('close-debug-window', windowID)
	})
}

export default openDebugClient
