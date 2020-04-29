import { element, style } from '@mkenzo_8/puffin'
import Buttons from './buttons'
import Logo from '../../../../assets/logo.svg'
import AppPlatform from 'AppPlatform'

const styleWrapper = style`
	&{
		padding:0px;
		display:flex;
		background:var(--titlebarBackground);
		max-height:40px;
		overflow:hidden;
		min-height:40px;
		margin-bottom: 3px;
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
	.logo {
		width:22px;
		padding:9px 13px;
		-webkit-app-region: drag;
	}
`

function getMacButtons(){
	if( AppPlatform == "darwin" ){
		return Buttons()
	}else{
		return element`<div/>`
	}
}

function getButtons(){
	if( AppPlatform == "win32" ){
		return Buttons()
	}else{
		return element`<div/>`
	}
}

function TitleBar(){
	return element({
		components:{
			Buttons
		}
	})`
	<div>
		<div class="${styleWrapper}">
			${getMacButtons()}
			${AppPlatform !== 'darwin' ? element`<img class="logo" draggable="false" src="${()=>Logo}" />` : '' }
			<div id="dropmenus" class="dropmenus"/>
			<div class="title"/>
			${getButtons()}
		</div>
	</div>
	`
}

export default TitleBar