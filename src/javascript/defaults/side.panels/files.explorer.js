import SidePanel from '../../constructors/side.panel'
import RunningConfig from 'RunningConfig'
import { element, style } from '@mkenzo_8/puffin'
import { Text } from '@mkenzo_8/puffin-drac'
import FolderOutlined from '../../components/icons/folder.outlined'
import Welcome from '../../defaults/windows/welcome'

const styleWrapper = style`
	& {
		min-width:75px;
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
		font-size: 13px;
	}
`


RunningConfig.on('appLoaded',()=>{
	const explorer = ()=> element({
		components:{
			Text
		}
	})`
		<div hasFiles="false" id="explorer_panel" class="${styleWrapper}">
			<div>
				<Text class="link" :click="${openFolderDialog}" lang-string="OpenFolder"></Text>
				<Text class="link" :click="${openProjects}" lang-string="OpenProjects"></Text>
				<Text class="link" :click="${openWorkspaces}" lang-string="OpenWorkspaces"></Text>
			</div>
		</div>`
	
	const { display } = new SidePanel({
		icon: FolderOutlined,
		panel: explorer
	})
	display()
})

function openProjects(){
	Welcome({
		defaultPage: 'projects'
	}).launch()
}

function openWorkspaces(){
	Welcome({
		defaultPage: 'workspaces'
	}).launch()
}

function openFolderDialog(){
	RunningConfig.emit('addFolderToRunningWorkspaceDialog',{
		replaceOldExplorer: true
	})
}
