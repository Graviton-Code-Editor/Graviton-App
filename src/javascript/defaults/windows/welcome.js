import { element, render, style } from '@mkenzo_8/puffin'
import { getWorkspaceConfig, openFolder } from '../../utils/filesystem.ts'
import { Button } from '@mkenzo_8/puffin-drac'
import { LanguageState } from 'LanguageConfig'
import { Card, Titles } from '@mkenzo_8/puffin-drac'
import SideMenu from '../../components/window/side.menu'
import parseDirectory from '../../utils/directory.parser'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import CardsListContainer from '../../components/welcome/cards.list'
import ContextMenu from '../../constructors/contextmenu'
import Window from '../../constructors/window'
import beautifyDir from '../../utils/directory.beautifier.js'
import normalizeDir from '../../utils/directory.normalizer.js'

function Welcome({ defaultPage = 'projects' } = {}) {
	const WelcomePage = element({
		components: {
			SideMenu,
			CardsListContainer,
			Button,
		},
	})`
		<SideMenu default="${defaultPage}">
			<div>
				<H1 lang-string="windows.Welcome.Welcome"/>
				<label to="projects" lang-string="windows.Welcome.RecentProjects"/>
				<label to="workspaces" lang-string="windows.Welcome.RecentWorkspaces"/>
				<label to="create_project" lang-string="windows.Welcome.NewProject"/>
			</div>
			<div>
				<CardsListContainer href="workspaces">
					<div>
						${StaticConfig.data.appWorkspacesLog.map(workspacePath => {
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
						})}
					</div>
					<div>
						<Button :click="${openWorkspaceFromWindow}" lang-string="windows.Welcome.OpenWorkspace"/>
					</div>
				</CardsListContainer>
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
						<Button :click="${openDirectoryFromWindow}" lang-string="windows.Welcome.OpenFolder/>
					</div>
				</CardsListContainer>
				<CardsListContainer href="create_project">
					<div>
						${RunningConfig.data.projectServices.map(({ name, description, onExecuted }) => {
							return element({
								components: {
									Card,
								},
							})`
								<Card :click="${onExecuted}" :click="${createProject}">
									<b>${name}</b>
									<p>${description}</p>
								</Card>
							`
						})}
					</div>
				</CardsListContainer>
			</div>
		</SideMenu>
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
		WelcomeWindow.close()
	}
	function openDirectory() {
		RunningConfig.emit('addFolderToRunningWorkspace', {
			folderPath: normalizeDir(this.getAttribute('directory')),
			replaceOldExplorer: true,
			workspacePath: null,
		})
		WelcomeWindow.close()
	}
	function createProject() {
		WelcomeWindow.close()
	}
	function openDirectoryFromWindow() {
		openFolder().then(folderPath => {
			RunningConfig.emit('addFolderToRunningWorkspace', {
				folderPath,
				replaceOldExplorer: true,
				workspacePath: null,
			})
		})
		WelcomeWindow.close()
	}
	function openWorkspaceFromWindow() {
		RunningConfig.emit('openWorkspaceDialog')
		WelcomeWindow.close()
	}
	const WelcomeWindow = new Window({
		title: 'welcome',
		component: () => WelcomePage,
		height: '400px',
		width: '600px',
	})
	return WelcomeWindow
}

export default Welcome
