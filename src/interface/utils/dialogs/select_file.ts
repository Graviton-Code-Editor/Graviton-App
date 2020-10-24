import Core from 'Core'
const {
	electron: { ipcRenderer },
} = Core

/**
 * Opens a native dialog to select a file
 * @constructor
 * @returns promise
 */

export default function selectFileDialog() {
	return new Promise(async (resolve, reject) => {
		ipcRenderer
			.invoke('open-file')
			.then(path => {
				resolve(path)
			})
			.catch(err => {
				reject(err)
			})
	})
}
