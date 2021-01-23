import { element } from '@mkenzo_8/puffin'
import { Titles } from '@mkenzo_8/puffin-drac'
import SideMenu from '../../components/window/side_menu'
import Window from '../../constructors/window'

import WorkspacesPage from '../dashboard/pages/workspaces'
import ProjectsPage from '../dashboard/pages/projects'
import NewProjectPage from '../dashboard/pages/new.project'

import { WindowInstance } from 'Types/window'

export default function Dashboard({ defaultPage = 'projects' } = {}): WindowInstance {
	const DashboardPage = element({
		components: {
			SideMenu,
			WorkspacesPage,
			ProjectsPage,
			NewProjectPage,
		},
	})`
		<SideMenu default="${defaultPage}">
			<div>
				<H1 lang-string="windows.Dashboard.Dashboard"/>
				<label to="projects" lang-string="windows.Dashboard.RecentProjects"/>
				<label to="workspaces" lang-string="windows.Dashboard.RecentWorkspaces"/>
				<label to="create_project" lang-string="windows.Dashboard.NewProject"/>
			</div>
			<div>
				<WorkspacesPage closeWindow="${() => DashboardWindow.close()}"/>
				<ProjectsPage closeWindow="${() => DashboardWindow.close()}"/>
				<NewProjectPage closeWindow="${() => DashboardWindow.close()}"/>
			</div>
		</SideMenu>
    `

	const DashboardWindow = new Window({
		title: 'dashboard',
		component: () => DashboardPage,
		height: '400px',
		width: '600px',
	})
	return DashboardWindow
}
