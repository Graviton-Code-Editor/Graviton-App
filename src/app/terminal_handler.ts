import * as nodePty from 'node-pty'
import { ipcMain } from 'electron'
const nodePtyProcesses = {}

export default window => {
	ipcMain.handle('create-local-shell', (e, { id, bin, cwd }) => {
		nodePtyProcesses[id] = nodePty.spawn(bin, [], {
			cwd,
			env: process.env,
		})

		nodePtyProcesses[id].on('data', (data: string) => {
			window.webContents.send('local-shell-data', {
				id,
				data,
			})
		})

		nodePtyProcesses[id].on('exit', () => {
			window.webContents.send('local-shell-closed', {
				id,
			})
		})

		ipcMain.on('local-shell-write', (e, { id: idMessenger, content }) => {
			if (id === idMessenger) {
				nodePtyProcesses[id].write(content)
			}
		})

		ipcMain.on('local-shell-resize', (e, { id: idMessenger, content: { cols, rows } }) => {
			if (id === idMessenger) {
				nodePtyProcesses[id].resize(cols, rows)
			}
		})
	})
}
