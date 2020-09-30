import { ipcRenderer } from 'electron'

/**
 * Opens a native dialog
 * to select files
 * @constructor
 * @returns promise
 */
function selectFileDialog() {
	return new Promise(async (resolve, reject) => {
		ipcRenderer
			.invoke('open-folder')
			.then(path => {
				resolve(path)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export default selectFileDialog
