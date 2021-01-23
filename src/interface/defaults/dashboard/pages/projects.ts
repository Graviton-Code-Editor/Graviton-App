import { element } from '@mkenzo_8/puffin'
import { openFolder } from 'FileSystem'
import { Card, Button } from '@mkenzo_8/puffin-drac'
import parseDirectory from '../../../utils/directory_parser'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import CardsListContainer from '../../../components/dashboard/cards.list'
import ContextMenu from '../../../constructors/contextmenu'
import beautifyDir from '../../../utils/directory_beautifier'
import normalizeDir from '../../../utils/directory_normalizer'

import { PuffinComponent } from 'Types/puffin.component'

export default function ProjectsPage({ closeWindow }): PuffinComponent {
	return element({
		components: {
			CardsListContainer,
			Button,
		},
	})`
		<CardsListContainer href="projects">
			<div>
				${StaticConfig.data.appProjectsLog.map(({ name, directory }) => {
					const nameFolder = parseDirectory(directory)
					return element({
						components: {
							Card,
						},
					})`
						<Card :contextmenu="${contextMenuProject}" :click="${openDirectory}" directory="${normalizeDir(directory)}">
							<b>${nameFolder}</b>
							<p>${beautifyDir(normalizeDir(directory))}</p>
						</Card>
					`
				})}
			</div>
			<div>
				<Button :click="${openDirectoryFromWindow}" lang-string="windows.Dashboard.OpenFolder"/>
			</div>
		</CardsListContainer>
    `
	function contextMenuProject(event) {
		new ContextMenu({
			list: [
				{
					label: 'Remove from here',
					action: () => {
						RunningConfig.emit('removeProjectFromLog', {
							projectPath: this.getAttribute('directory'),
						})
						this.remove()
					},
				},
			],
			event,
			parent: this,
		})
	}
	function openDirectory() {
		RunningConfig.emit('addFolderToRunningWorkspace', {
			folderPath: normalizeDir(this.getAttribute('directory')),
			replaceOldExplorer: true,
			workspacePath: null,
		})
		closeWindow()
	}
	function openDirectoryFromWindow() {
		openFolder().then(folderPath => {
			RunningConfig.emit('addFolderToRunningWorkspace', {
				folderPath,
				replaceOldExplorer: true,
				workspacePath: null,
			})
		})
		closeWindow()
	}
}
