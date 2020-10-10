import RunningConfig from 'RunningConfig'

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
		RunningConfig.emit('registerTerminalClient', {
			name: 'cmd',
			onCreated(state){
				const spawnProcess = createProcess(process.env['COMSPEC'])

				spawnProcess.on('data', function (data: any) {
					state.emit('write', data)
				})

				state.on('data', (data) => {
					spawnProcess.write(data)
				})
			}
		})
	}else{
		// Linux's configured terminal ($SHELL) Client for Terminal 
		RunningConfig.emit('registerTerminalClient', {
			name: process.env['SHELL'],
			onCreated(state){
				const spawnProcess = createProcess(process.env['SHELL'])

				spawnProcess.on('data', function (data: any) {
					state.emit('write', data)
				})

				state.on('data', (data) => {
					spawnProcess.write(data)
				})
			}
		})
	}
})

