import SidePanel from '../../constructors/side.panel'
import RunningConfig from 'RunningConfig'
import { element, style } from '@mkenzo_8/puffin'
import { Text } from '@mkenzo_8/puffin-drac'
import FolderOutlined from '../../components/icons/folder.outlined'
import Welcome from '../../defaults/windows/welcome'
import { openFolder } from '../../utils/filesystem'

const styleWrapper = style`
	& {
		min-width:75px;
		user-select: none;
	}
	& > div {
		text-align: center;
	}
	&[hasFiles="false"] {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100%;
	}
	&[hasFiles="true"] .link{
		display: none;
	}
	& .link{
		text-decoration: underline;
		cursor: pointer;
		font-size: 12px;
	}
`

RunningConfig.on('appLoaded', () => {
	const explorer = () => element({
		components: {
			Text,
		},
	})`
		<div hasFiles="false" id="explorer_panel" class="${styleWrapper}">
			<div>
				<Text class="link" :click="${openFolderDialog}" lang-string="menus.File.OpenFolder"/>
				<Text class="link" :click="${openProjects}" lang-string="menus.File.Projects.OpenProjects"/>
				<Text class="link" :click="${openWorkspaces}" lang-string="menus.File.Workspaces.OpenWorkspaces"/>
			</div>
		</div>`

	const { display } = new SidePanel({
		icon: FolderOutlined,
		panel: explorer,
		hint: 'Files explorer',
	})
	display()
})

function openProjects() {
	Welcome({
		defaultPage: 'projects',
	}).launch()
}

function openWorkspaces() {
	Welcome({
		defaultPage: 'workspaces',
	}).launch()
}

function openFolderDialog() {
	openFolder().then(function (folderPath) {
		RunningConfig.emit('addFolderToRunningWorkspace', {
			folderPath,
			replaceOldExplorer: true,
			workspacePath: null,
		})
	})
}
