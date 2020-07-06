import InputDialog from '../../constructors/dialog.input'
import RunningConfig from 'RunningConfig'
import normalizeDir from '../../utils/directory.normalizer'

const fs = window.require('fs-extra')
const path = window.require('path')

function newDirectoryDialog({ isFolder, parentDirectory, container, explorerState }) {
	new InputDialog({
		title: isFolder ? 'New Folder' : 'New file',
		placeHolder: isFolder ? 'Folder' : 'File',
	})
		.then(function (res) {
			createDirectory(res, isFolder, parentDirectory, container, explorerState)
		})
		.catch(function () {
			//Do nothing since there is nothing to create
		})
}

function createDirectory(value, isFolder, parentDirectory, container, explorerState) {
	const itemDirectory = normalizeDir(path.join(parentDirectory, value), true)
	if (!fs.existsSync(itemDirectory)) {
		if (isFolder) {
			if (!fs.existsSync(itemDirectory)) {
				fs.mkdirSync(itemDirectory)
				explorerState.emit('createItem', {
					container: container,
					containerFolder: normalizeDir(container.getAttribute('parentfolder')),
					level: container.getAttribute('level'),
					directory: itemDirectory,
					directoryName: path.basename(itemDirectory),
					isFolder: true,
				})
			}
		} else {
			fs.writeFile(itemDirectory, '', err => {
				if (err) throw err
				explorerState.emit('createItem', {
					container: container,
					containerFolder: normalizeDir(container.getAttribute('parentfolder')),
					level: container.getAttribute('level'),
					directory: itemDirectory,
					directoryName: path.basename(itemDirectory),
					isFolder: false,
				})
			})
		}
	}
}

export default newDirectoryDialog
