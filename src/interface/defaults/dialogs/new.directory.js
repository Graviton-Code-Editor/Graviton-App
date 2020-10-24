import InputDialog from '../../utils/dialogs/dialog.input'
import RunningConfig from 'RunningConfig'
import normalizeDir from '../../utils/directory_normalizer'
import * as path from 'path'
import Core from 'Core'
const { fs } = Core

function newDirectoryDialog({ isFolder, parentDirectory, container, explorerState, explorerProvider }) {
	new InputDialog({
		title: isFolder ? 'New Folder' : 'New file',
		placeHolder: isFolder ? 'Folder' : 'File',
	})
		.then(function (res) {
			createDirectory(res, isFolder, parentDirectory, container, explorerState, explorerProvider)
		})
		.catch(function () {
			//Do nothing since there is nothing to create
		})
}

async function createDirectory(value, isFolder, parentDirectory, container, explorerState, explorerProvider) {
	const itemDirectory = normalizeDir(path.join(parentDirectory, value), true)
	if (!(await explorerProvider.exists(itemDirectory))) {
		if (isFolder) {
			await explorerProvider.mkdir(itemDirectory)
			explorerState.emit('createItem', {
				container,
				containerFolder: normalizeDir(container.getAttribute('parentfolder')),
				level: container.getAttribute('level'),
				directory: itemDirectory,
				directoryName: path.basename(itemDirectory),
				isFolder: true,
				isHidden: false,
			})
		} else {
			explorerProvider.writeFile(itemDirectory, '', err => {
				if (err) throw err
				explorerState.emit('createItem', {
					container,
					containerFolder: normalizeDir(container.getAttribute('parentfolder')),
					level: container.getAttribute('level'),
					directory: itemDirectory,
					directoryName: path.basename(itemDirectory),
					isFolder: false,
					isHidden: false,
				})
			})
		}
	}
}

export default newDirectoryDialog
