import { element } from '@mkenzo_8/puffin'
import { Titles } from '@mkenzo_8/puffin-drac'
import SideMenu from '../../components/window/side_menu'
import Window from '../../constructors/window'

import WorkspacesPage from '../welcome/pages/workspaces'
import ProjectsPage from '../welcome/pages/projects'
import NewProjectPage from '../welcome/pages/new.project'

import { WindowInstance } from 'Types/window'

function Welcome({ defaultPage = 'projects' } = {}): WindowInstance {
	const WelcomePage = element({
		components: {
			SideMenu,
			WorkspacesPage,
			ProjectsPage,
			NewProjectPage,
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
				<WorkspacesPage closeWindow="${() => WelcomeWindow.close()}"/>
				<ProjectsPage closeWindow="${() => WelcomeWindow.close()}"/>
				<NewProjectPage closeWindow="${() => WelcomeWindow.close()}"/>
			</div>
		</SideMenu>
    `

	const WelcomeWindow = new Window({
		title: 'welcome',
		component: () => WelcomePage,
		height: '400px',
		width: '600px',
	})
	return WelcomeWindow
}

export default Welcome
