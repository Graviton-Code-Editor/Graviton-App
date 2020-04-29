import SidePanel from '../../constructors/side.panel'
import RunningConfig from 'RunningConfig'
import { element } from '@mkenzo_8/puffin'
import FolderOutlined from '../../components/icons/folder.outlined'

RunningConfig.on('appLoaded',()=>{
	
	const explorer = ()=> element`<div id="explorer-panel"/>`
	
	const { display } = new SidePanel({
		icon: FolderOutlined,
		panel: explorer
	})
	display()
	
})