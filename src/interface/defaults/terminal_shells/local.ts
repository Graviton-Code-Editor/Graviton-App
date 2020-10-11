import RunningConfig from 'RunningConfig'
import { element } from '@mkenzo_8/puffin'

function createProcess(bin) {
	const pty = window.require('node-pty')
	return pty.spawn(bin, [], {
		cwd: process.env.HOMEPATH,
		env: process.env,
	})
}

RunningConfig.once('appLoaded', () => {
	if (process.platform === 'win32') {
		// CMD Client for Terminal
		RunningConfig.emit('registerTerminalShell', {
			name: 'cmd',
			onCreated(state) {
				const spawnProcess = createProcess(process.env['COMSPEC'])

				spawnProcess.on('data', function (data: any) {
					state.emit('write', data)
				})

				state.on('data', data => {
					spawnProcess.write(data)
				})

				return {
					accessories: RunningConfig.data.localTerminalAccessories,
				}
			},
		})
		RunningConfig.emit('registerTerminalShell', {
			name: 'funny',
			onCreated(state) {
				state.on('data', data => {
					state.emit('write', Math.random().toString())
				})

				return {
					accessories: [
						{
							component() {
								return element`<span> hello! </span>`
							},
						},
						{
							component() {
								return element`<span> hello! </span>`
							},
						},
					],
				}
			},
		})
	} else {
		// Linux's configured terminal ($SHELL) Client for Terminal
		RunningConfig.emit('registerTerminalShell', {
			name: process.env['SHELL'],
			onCreated(state) {
				const spawnProcess = createProcess(process.env['SHELL'])

				spawnProcess.on('data', function (data: any) {
					state.emit('write', data)
				})

				state.on('data', data => {
					spawnProcess.write(data)
				})
			},
		})
	}
})
