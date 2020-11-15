import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import Buttons from './buttons'
import Logo from '../../../../assets/logo.svg'
import AppPlatform from 'AppPlatform'
import RunningConfig from 'RunningConfig'

const isBrowser = RunningConfig.data.isBrowser

const styleWrapper = style`
	.app-container[os="darwin"] &, .app-container[os="linux"] & {
		min-height:0px;
		max-height:0px;
		height:0px;
		background: red;
	}
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
		height: 33px;
	}
	.logo {
		width:22px;
		padding:9px 13px;
		-webkit-app-region: drag;
	}
`

function getButtons() {
	if (AppPlatform == 'win32') {
		return Buttons()
	} else {
		return element`<div/>`
	}
}

function getLogo() {
	return AppPlatform === 'win32' || isBrowser ? element`<img class="logo" draggable="false" src="${Logo}" />` : ''
}

function TitleBar() {
	return element({
		components: {
			Buttons,
		},
	})`
	<div class="${styleWrapper}" style="${AppPlatform !== 'win32' ? 'margin:0;' : ''}">
		${getLogo()}
		<div id="dropmenus" class="dropmenus"/>
		<div class="title"/>
		${getButtons()}
	</div>
	`
}

export default TitleBar
