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
				<div id="sidebar" :contextmenu="${sidebarContext}" style="${() => (StaticConfig.data.appEnableSidebar ? 'opacity:1' : 'opacity:0;width:10px;')}"/>
				<div id="sidepanel"/>
				<Resizer/>
				<div id="mainpanel"/>          
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
	})
}

function sidebarContext(e) {
	if (StaticConfig.data.appEnableSidebar) {
		new ContextMenu({
			list: [
				{
					label: 'Hide',
					action() {
						StaticConfig.data.appEnableSidebar = false
					},
				},
			],
			parent: document.body,
			event: e,
		})
	} else {
		new ContextMenu({
			list: [
				{
					label: 'Show',
					action() {
						StaticConfig.data.appEnableSidebar = true
					},
				},
			],
			parent: document.body,
			event: e,
		})
	}
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
