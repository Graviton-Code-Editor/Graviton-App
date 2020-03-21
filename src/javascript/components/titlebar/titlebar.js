import { puffin } from '@mkenzo_8/puffin'
import DropMenu from '../dropmenu'
import Buttons from './buttons'
import Logo from '../../../../assets/logo.svg'
const os = eval('process.platform')

const TitleBar = puffin.element(`
	<div>
		<div class="${puffin.style.css`
			&{
				padding:0px;
				display:flex;
				background:var(--titlebarBackground);
				max-height:40px;
				overflow:hidden;
				min-height:40px;
			}
			& *{
				user-select:none;
			}
			& .title{
				-webkit-app-region: drag;
				flex:1;
				width:auto;
			}
			& .dropmenus{
				min-width:auto; 
				width:auto;
				overflow:hidden; 
				overflow-x:auto;
				display:flex;
			}
			& .dropmenus::-webkit-scrollbar {
				height:4px;
			}
			& .buttons{
				max-width:auto;
				width:auto;
				display:flex;
			}
			.logo{
				width:27px;
				padding:9px;
			}
		`}">
		${os === "darwin"?'<Buttons/>':''}
		${os !== "darwin"?`<img draggable="false" src="${Logo}" class="logo"/>`:''} 
		<div id="dropmenus" class="dropmenus"/>
		<div class="title"/>
		${os === "win32"?'<Buttons/>':''}
		</div>
	</div>
	`,{
	components:{
		DropMenu,
		Buttons
	}
})

export default TitleBar