import RunningConfig from 'RunningConfig'
const { spawn } = window.require('child_process')
import selectFolderDialog from '../../utils/dialogs/select.folder'
import Notification from '../../constructors/notification'

RunningConfig.data.projectServices.push({
	name: 'NodeJS',
	description: 'Create basic project',
	onExecuted,
})

function onExecuted() {
	selectFolderDialog().then(location => {
		let cmdPath
		if (window.process.platform === 'win32') {
			cmdPath = 'npm.cmd'
		} else {
			cmdPath = 'npm'
		}
		const npmInit = spawn(cmdPath, ['init', '--force'], {
			cwd: location,
		})
		npmInit.on('close', code => {
			if (code === 0) {
				new Notification({
					title: 'NodeJS Project',
					content: 'Successfully created.',
				})
				RunningConfig.emit('addFolderToRunningWorkspace', {
					folderPath: location,
					replaceOldExplorer: true,
					workspacePath: null,
				})
			} else {
				new Notification({
					title: 'NodeJS Project',
					content: 'Something went wrong',
				})
			}
		})
	})
}
