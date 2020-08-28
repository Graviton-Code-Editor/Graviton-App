import { element, style } from '@mkenzo_8/puffin'
import StatusBarItem from '../../constructors/status.bar.item'
import RunningConfig from 'RunningConfig'

const styleWrapper = style`
	& {
		color:var(--statusbarGitItemText);
	}
	&.active{
		color:var(--statusbarGitItemModifiedText) !important;
	}
`

function branchIndicator() {
	let currentRepo = {
		branch: '',
		anyChanges: false,
		parentFolder: '',
	}
	let repos = {}

	return element`
		<span mounted="${mounted}" class="${styleWrapper}">${() => currentRepo.branch}</span>
	`
	function mounted() {
		const updateRepo = data => {
			currentRepo = data
			repos[data.parentFolder] = data
			this.update()

			branchIndicatorItem.show()

			if (data.anyChanges) {
				this.classList.add('active')
			} else {
				this.classList.remove('active')
			}
		}

		RunningConfig.on('loadedGitRepo', function () {
			updateRepo(arguments[0])
		})

		RunningConfig.on('gitStatusUpdated', function () {
			updateRepo(arguments[0])
		})

		RunningConfig.on('aTabHasBeenFocused', ({ projectPath }) => {
			if (repos[projectPath]) {
				//Check if there is any git-data cached
				updateRepo(repos[projectPath])
			}
		})

		RunningConfig.on('removeFolderFromRunningWorkspace', ({ folderPath }) => {
			if (currentRepo.parentFolder === folderPath) {
				this.classList.remove('active')
				branchIndicatorItem.hide()
			}
		})
	}
}

const branchIndicatorItem = new StatusBarItem({
	component: branchIndicator,
	position: 'right',
})

RunningConfig.on('appLoaded', () => {
	branchIndicatorItem.hide()
})
