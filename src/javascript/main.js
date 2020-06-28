//Renderer process
import { element, style, render } from '@mkenzo_8/puffin'
import TitleBar from './components/titlebar/titlebar'
import SplashScreen from './components/splash.screen'
import init from './defaults/initial'
import Welcome from './defaults/windows/welcome'
import ThemeProvider from 'ThemeProvider'
import Resizer from './components/panel/resizer.horizontally'
import StatusBar from './components/status.bar/status.bar'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import ContextMenu from './constructors/contextmenu'
import AppBody from './components/app'
const isDev = window.require('electron-is-dev')
import AppPlatform from 'AppPlatform'
window.require('v8-compile-cache')

import '../sass/main.scss'

let blurViewApp = false

const App = element({
	components: {
		TitleBar,
		SplashScreen,
		StatusBar,
		Resizer,
		AppBody,
	},
})`
    <AppBody mounted="${mountedApp}" class="app-container" os="${AppPlatform}">
		<div mounted="${mountedAppView}" style="${() => (blurViewApp ? `filter:blur(${StaticConfig.data.appBlurEffect}px);` : '')}">
			<TitleBar/>
			<div id="body">
				<div id="sidebar" :contextmenu="${sidebarContext}" style="${() =>
	StaticConfig.data.appEnableSidebar
		? 'opacity:1; margin-right: 1px;'
		: StaticConfig.data.appEnableSidepanel
		? 'opacity:0;min-width:20px;width:20px;'
		: 'opacity:0;min-width:0;width:0; margin:0; padding:0; border:0;'}"/>
				<div id="sidepanel" style="${StaticConfig.data.appEnableSidepanel ? 'opacity:1' : 'opacity:0;min-width:0px;width:0px; padding:0;margin:0;'}"/>
				<Resizer/>
				<div id="mainpanel" blocked="${() => !StaticConfig.data.appEnableSidepanel && !StaticConfig.data.appEnableSidebar}" />          
			</div>
			<StatusBar/>
		</div>
		<div id="windows"/>
		<div id="notifications"/>
		<SplashScreen/>
	</AppBody>
`
function mountedAppView() {
	RunningConfig.keyChanged('openedWindows', value => {
		if (value <= 0) {
			blurViewApp = false
		} else {
			blurViewApp = true
		}
		this.update()
	})
	StaticConfig.keyChanged('appBlurEffect', value => {
		if (blurViewApp) {
			this.update()
		}
	})
	StaticConfig.keyChanged('appEnableSidebar', value => {
		document.getElementById('sidebar').update()
		document.getElementById('mainpanel').update()
	})
	StaticConfig.keyChanged('appEnableSidepanel', value => {
		document.getElementById('sidebar').update()
		document.getElementById('mainpanel').update()
		if (!value) {
			document.getElementById('sidepanel').style = 'opacity:0;min-width:0px;width:0px; padding:0;margin:0;'
		} else {
			document.getElementById('sidepanel').style = 'opacity: 1'
		}
	})
}

function sidebarContext(e) {
	let list = []
	if (StaticConfig.data.appEnableSidebar) {
		list.push({
			label: 'menus.View.HideSidebar',
			action() {
				StaticConfig.data.appEnableSidebar = false
			},
		})
	} else {
		list.push({
			label: 'menus.View.ShowSidebar',
			action() {
				StaticConfig.data.appEnableSidebar = true
			},
		})
	}
	if (StaticConfig.data.appEnableSidepanel) {
		list.push({
			label: 'menus.View.HideSidepanel',
			action() {
				StaticConfig.data.appEnableSidepanel = false
			},
		})
	} else {
		list.push({
			label: 'menus.View.ShowSidepanel',
			action() {
				StaticConfig.data.appEnableSidepanel = true
			},
		})
	}
	new ContextMenu({
		list,
		parent: document.body,
		event: e,
	})
}

function mountedApp() {
	init()
	window.addEventListener('load', function () {
		if (((!isDev && RunningConfig.data.arguments[0] == null) || isDev) && StaticConfig.data.appOpenWelcomeInStartup) {
			Welcome().launch()
		}
	})
}

render(App, document.getElementById('App'))
