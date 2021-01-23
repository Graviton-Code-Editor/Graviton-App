import { element } from '@mkenzo_8/puffin'
import { getWorkspaceConfig } from 'FileSystem'
import { Card, Button } from '@mkenzo_8/puffin-drac'
import parseDirectory from '../../../utils/directory_parser'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import CardsListContainer from '../../../components/dashboard/cards.list'
import ContextMenu from '../../../constructors/contextmenu'

import { PuffinComponent } from 'Types/puffin.component'

export default function WorkspacesPage({ closeWindow }): PuffinComponent {
	return element({
		components: {
			CardsListContainer,
			Button,
		},
	})`
		<CardsListContainer href="workspaces">
			<div>
				${StaticConfig.data.appWorkspacesLog
					.map(workspacePath => {
						const workspaceConfig = getWorkspaceConfig(workspacePath)
						if (workspaceConfig) {
							const { name, folders = [] } = workspaceConfig
							const listContent = folders.map(({ name, path }) => {
								return element`<li>· ${parseDirectory(name)}</li>`
							})
							return element({
								components: {
									Card,
								},
							})`
							<Card :click="${openWorkspace}" directory="${workspacePath}" :contextmenu="${contextMenuWorkspace}">
								<b>${name}</b>
								<ul>
									${listContent}
								</ul>
							</Card>
						`
						}
					})
					.filter(Boolean)}
			</div>
			<div>
				<Button :click="${openWorkspaceFromWindow}" lang-string="windows.Dashboard.OpenWorkspace"/>
			</div>
		</CardsListContainer>
    `
	function contextMenuWorkspace(event) {
		new ContextMenu({
			list: [
				{
					label: 'Rename',
					action: () => {
						RunningConfig.emit('renameWorkspaceDialog', {
							workspacePath: this.getAttribute('directory'),
							name: this.children[0].textContent,
							onFinished: newName => {
								this.children[0].textContent = newName
							},
						})
					},
				},
				{
					label: 'Remove from here',
					action: () => {
						RunningConfig.emit('removeWorkspaceFromLog', {
							workspacePath: this.getAttribute('directory'),
						})
						this.remove()
					},
				},
			],
			event,
			parent: this,
		})
	}
	function openWorkspace() {
		RunningConfig.emit('setWorkspace', {
			workspacePath: this.getAttribute('directory'),
		})
		closeWindow()
	}
	function openWorkspaceFromWindow() {
		RunningConfig.emit('openWorkspaceDialog')
		closeWindow()
	}
}
