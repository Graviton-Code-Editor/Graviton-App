import { ipcMain, dialog, BrowserWindow } from 'electron'
import * as isDev from 'electron-is-dev'
import * as url from 'url'
import * as path from 'path'

export default window => {
	ipcMain.on('close-window', (e, windowID) => {
		if (window.windowID === windowID) window.close()
	})

	ipcMain.on('maximize-window', (e, windowID) => {
		if (window.windowID === windowID) {
			if (window.isMaximized()) {
				window.unmaximize()
			} else {
				window.maximize()
			}
		}
	})

	ipcMain.on('minimize-window', (e, windowID) => {
		if (window.windowID === windowID) window.minimize()
	})

	ipcMain.handle('open-folder', async () => {
		return new Promise(res => {
			dialog
				.showOpenDialog(window, {
					properties: ['openDirectory'],
				})
				.then(result => {
					if (result.canceled) return
					res(result.filePaths[0])
				})
				.catch(err => {
					//
				})
		})
	})

	ipcMain.handle('toggle-devtools', async (e, config) => {
		window.toggleDevTools()
	})

	ipcMain.handle('open-file', async () => {
		return new Promise(res => {
			dialog
				.showOpenDialog(window, {
					properties: ['openFile'],
				})
				.then(result => {
					if (result.canceled) return
					res(result.filePaths[0])
				})
				.catch(err => {
					//
				})
		})
	})
}
