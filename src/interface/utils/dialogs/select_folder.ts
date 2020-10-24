import Core from 'Core'
const {
	electron: { ipcRenderer },
} = Core

/**
 * Opens a native dialog to select a folder
 * @constructor
 * @returns promise
 */

export default function selectFolderDialog() {
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
