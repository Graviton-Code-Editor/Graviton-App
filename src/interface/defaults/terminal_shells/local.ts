import RunningConfig from 'RunningConfig'
import { element } from '@mkenzo_8/puffin'
import Core from 'Core'
const { fs } = Core

export function createProcess(bin, cwd = process.env.HOMEPATH) {
	const pty = window.require('node-pty')
	return pty.spawn(bin, [], {
		cwd,
		env: process.env,
	})
}

RunningConfig.once('appLoaded', () => {
	if (RunningConfig.data.isBrowser) return
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
		const WSLPath = 'C:/Windows/System32/wsl.exe'
		fs.lstat(WSLPath)
			.then(() => {
				RunningConfig.emit('registerTerminalShell', {
					name: 'wsl',
					onCreated(state) {
						const spawnProcess = createProcess(WSLPath)

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
			})
			.catch(() => {
				// WSL is not enabled
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

				return {
					accessories: RunningConfig.data.localTerminalAccessories,
				}
			},
		})
	}
})
