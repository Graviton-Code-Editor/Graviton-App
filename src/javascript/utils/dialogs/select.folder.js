const { remote } = window.require('electron')
const { dialog, getCurrentWindow } = remote
import normalizeDir from '../directory.normalizer'

/**
 * Opens a native dialog
 * to select folders
 * @constructor
 * @returns promise
 */
function selectFolderDialog() {
	return new Promise((resolve, reject) => {
		dialog
			.showOpenDialog(getCurrentWindow(), {
				properties: ['openDirectory'],
			})
			.then(result => {
				if (result.canceled) return
				const folderPath = normalizeDir(result.filePaths[0])
				resolve(folderPath)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export default selectFolderDialog
