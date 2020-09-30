import EnvClient from '../constructors/env.client'
import { ipcRenderer } from 'electron'
import RunningConfig from 'RunningConfig'
const url = window.require('url')
const path = window.require('path')

function openDebugClient() {
	let windowID = Math.random()

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
