import InputDialog from '../../utils/dialogs/dialog_input'
import RunningConfig from 'RunningConfig'
import normalizeDir from '../../utils/directory_normalizer'
import * as path from 'path'
import Core from 'Core'
const { fs } = Core

/*
 * This provide a Dialog with an input to create a folder or a file
 * This is mainly used in the Explorer's item context menu
 */

function newDirectoryDialog({ isFolder, parentDirectory, container, explorerState, explorerProvider }) {
	InputDialog({
		title: isFolder ? 'misc.NewFolder' : 'misc.NewFile',
		placeHolder: isFolder ? 'Folder' : 'File',
	})
		.then(async (itemName: string) => {
			const itemDirectory = normalizeDir(path.join(parentDirectory, itemName))
			const isSuccessful = await createItem(isFolder, itemDirectory, container, explorerState, explorerProvider)
			if (!isFolder && isSuccessful) {
				RunningConfig.emit('loadFile', {
					filePath: itemDirectory,
				})
			}
		})
		.catch(function () {
			//Do nothing since there is nothing to create
		})
}

function createItem(isFolder, itemDirectory, container, explorerState, explorerProvider) {
	return new Promise(async resolve => {
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
				resolve(true)
			} else {
				await explorerProvider.writeFile(itemDirectory, '')
				explorerState.emit('createItem', {
					container,
					containerFolder: normalizeDir(container.getAttribute('parentfolder')),
					level: container.getAttribute('level'),
					directory: itemDirectory,
					directoryName: path.basename(itemDirectory),
					isFolder: false,
					isHidden: false,
				})
				resolve(true)
			}
		} else {
			resolve(false)
		}
	})
}

export default newDirectoryDialog
