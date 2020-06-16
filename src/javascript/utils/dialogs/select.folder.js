const { remote } = window.require('electron')
import normalizeDir from '../directory.normalizer'

/**
 * Opens a native dialog
 * to select folders
 * @constructor
 * @returns promise
 */
function selectFolderDialog() {
	return new Promise((resolve, reject) => {
		const { dialog, getCurrentWindow } = remote
		dialog
			.showOpenDialog(getCurrentWindow(), {
				properties: ['openDirectory'],
			})
			.then(result => {
				if (result.canceled) return
				console.log(result.filePaths[0], normalizeDir(result.filePaths[0]))
				resolve(normalizeDir(result.filePaths[0]))
			})
			.catch(err => {
				reject(err)
			})
	})
}

export default selectFolderDialog
