import RunningConfig from 'RunningConfig'
import Core from 'Core'
const {
	childProcess: { spawn },
} = Core
import selectFolderDialog from '../../utils/dialogs/select_folder'
import Notification from '../../constructors/notification'
import * as path from 'path'

RunningConfig.data.projectServices.push({
	name: 'NPM',
	description: 'Create basic NPM project',
	onExecuted,
})

const isNPMNameValid = name => !name.match(/([ ]|[A-Z])/gm)

function onExecuted() {
	selectFolderDialog().then((location: string) => {
		const folderName = path.basename(location)
		const validNPMName = isNPMNameValid(folderName)

		if (!validNPMName) {
			return new Notification({
				title: 'NPM Project',
				content: `Selected folder's name is not valid`,
			})
		}

		let cmdPath: string = ''

		if (window.process.platform === 'win32') {
			cmdPath = 'npm.cmd'
		} else {
			cmdPath = 'npm'
		}

		const npmInit = spawn(cmdPath, ['init', '--force'], {
			cwd: location,
		})

		npmInit.on('close', (code: number) => {
			if (code === 0) {
				new Notification({
					title: 'NPM Project',
					content: 'Successfully created.',
				})

				RunningConfig.emit('addFolderToRunningWorkspace', {
					folderPath: location,
					replaceOldExplorer: true,
					workspacePath: null,
				})
			} else {
				new Notification({
					title: 'NPM Project',
					content: 'Something went wrong',
				})
			}
		})
	})
}
