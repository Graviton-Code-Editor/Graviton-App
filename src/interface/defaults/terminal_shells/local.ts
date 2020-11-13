import RunningConfig from 'RunningConfig'
import { element } from '@mkenzo_8/puffin'
import Core from 'Core'
const { fs } = Core
import * as path from 'path'

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
			name: 'CMD',
			onCreated(state) {
				createLocalShell(state, process.env['COMSPEC'])
				return {
					accessories: RunningConfig.data.localTerminalAccessories,
				}
			},
		})
		RunningConfig.emit('registerTerminalShell', {
			name: 'PowerShell',
			onCreated(state) {
				createLocalShell(state, 'powershell.exe')
				return {
					accessories: RunningConfig.data.localTerminalAccessories,
				}
			},
		})
		const WSLPath = 'C:/Windows/System32/wsl.exe'
		fs.lstat(WSLPath)
			.then(() => {
				RunningConfig.emit('registerTerminalShell', {
					name: 'WSL',
					onCreated(state) {
						createLocalShell(state, WSLPath)
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
				createLocalShell(state, process.env['SHELL'])
				return {
					accessories: RunningConfig.data.localTerminalAccessories,
				}
			},
		})
	}
})

function createLocalShell(state, shellBin) {
	const spawnProcess = createProcess(shellBin)

	/*
	 * Write process's output to the emulator
	 */
	spawnProcess.on('data', function (data: any) {
		state.emit('write', data)
	})

	/*
	 * Resize the process'sterminal when the emulator is resized
	 */
	state.on('resize', ({ rows, cols }) => {
		spawnProcess.resize(cols, rows)
	})

	/*
	 * Write emulator's input to the process
	 */
	state.on('data', data => {
		spawnProcess.write(data)
	})
}
