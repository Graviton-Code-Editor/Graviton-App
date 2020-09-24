const { remote } = window.require('electron')
const { dialog, getCurrentWindow } = remote
import normalizeDir from '../directory.normalizer'

/**
 * Opens a native dialog
 * to select files
 * @constructor
 * @returns promise
 */
function selectFileDialog() {
	return new Promise((resolve, reject) => {
		dialog
			.showOpenDialog(getCurrentWindow(), {
				properties: ['openFile'],
			})
			.then(result => {
				if (result.canceled) return
				const filePath = normalizeDir(result.filePaths[0])
				resolve(filePath)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export default selectFileDialog
