import SidePanel from 'Constructors/side.panel'
import RunningConfig from 'RunningConfig'
import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'
import { Text } from '@mkenzo_8/puffin-drac'
import FolderOutlined from '../../components/icons/folder.outlined'
import Welcome from '../../defaults/windows/welcome'
import { openFolder } from 'FileSystem'

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
		display: block;
		border: 0;
		background:transparent;
		padding: 1px;
		cursor: pointer;
		border-radius: 10px;
		margin: 1px auto;
		&:focus{
			transition: 0.05s;
			background: var(--textFocusedBackground);
		}
		&:hover > p{
			text-decoration: underline;
		}
		& > p{
			margin: 0px;
			font-size: 13px;
			text-decoration: none;
			text-align: center;
		}
	}
`

RunningConfig.on('appLoaded', () => {
	const explorer = () => element()`
		<div hasFiles="false" id="explorer_panel" class="${styleWrapper}">
			${
				RunningConfig.data.isBrowser
					? element({
							components: {
								Text,
							},
					  })`
				<div>
					<Text>Join a room!</Text>
				</div>
			`
					: element({
							components: {
								Text,
							},
					  })`
			<div>
				<button class="link" :click="${openFolderDialog}">
						<Text lang-string="menus.File.OpenFolder"/>
				</button>
				<button class="link" :click="${openProjects}"> 
						<Text lang-string="menus.File.Projects.OpenProjects"/>
				</button>
				<button class="link" :click="${openWorkspaces}"> 
					<Text lang-string="menus.File.Workspaces.OpenWorkspaces"/>
				</button>
			</div>
			`
			}
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
