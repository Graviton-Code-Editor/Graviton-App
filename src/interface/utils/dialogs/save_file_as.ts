import Core from 'Core'
const {
	electron: { ipcRenderer },
} = Core

/**
 * Opens a native dialog to save a file
 * @constructor
 * @returns promise
 */
export default function saveFileAsDialog() {
	return new Promise(async (resolve, reject) => {
		ipcRenderer
			.invoke('save-file-as')
			.then(path => {
				resolve(path)
			})
			.catch(err => {
				reject(err)
			})
	})
}
