//Renderer process
import { element, style, render } from '@mkenzo_8/puffin'
import TitleBar from './components/titlebar/titlebar'
import SplashScreen from './components/splash.screen'
import init from './defaults/initial'
import Welcome from './defaults/windows/welcome'
import Resizer from './components/panel/resizer.horizontally'
import StatusBar from './components/status.bar/status.bar'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import ContextMenu from './constructors/contextmenu'
import AppBody from './components/app'
const isDev = window.require('electron-is-dev')
import AppPlatform from 'AppPlatform'
import '../sass/main.scss'

import PuffinElement from './types/puffin.element'

window.require('v8-compile-cache')

let blurViewApp: boolean = false

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
		<div mounted="${mountedAppView}" style="${handleAppviewState}">
			<TitleBar/>
			<div id="body">
				<div id="sidebar" :contextmenu="${sidebarContext}" style="${handleSidebarState}"/>
				<div id="sidepanel" style="${handlesidePanelState}"/>
				<Resizer/>
				<div id="mainpanel" blocked="${handleMainpanelState}" />          
			</div>
			<StatusBar/>
		</div>
		<div id="windows"/>
		<div id="notifications"/>
		<SplashScreen/>
	</AppBody>
`

function handleAppviewState() {
	if (blurViewApp) {
		return `filter: blur(${StaticConfig.data.appBlurEffect}px);`
	} else {
		return ''
	}
}

function handlesidePanelState(): string {
	if (StaticConfig.data.appEnableSidepanel) {
		return 'opacity:1'
	} else {
		return 'opacity:0; min-width:0px; width:0px; padding:0; margin:0;'
	}
}

function handleMainpanelState(): boolean {
	return !StaticConfig.data.appEnableSidepanel && !StaticConfig.data.appEnableSidebar
}

function handleSidebarState(): string {
	if (StaticConfig.data.appEnableSidebar) {
		return 'opacity:1; margin-right:1px;'
	} else if (StaticConfig.data.appEnableSidepanel) {
		return 'opacity:0; min-width:20px; width:20px;'
	} else {
		return 'opacity:0; min-width:0; width:0; margin:0; padding:0; border:0;'
	}
}

function mountedAppView(): void {
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
		const sideBar =  (<PuffinElement>document.getElementById('sidebar'))
		sideBar.update()
	})
	StaticConfig.keyChanged('appEnableSidepanel', value => {
		const sidePanel = (<PuffinElement>document.getElementById('sidepanel'))
		const sideBar =  (<PuffinElement>document.getElementById('sidebar'))
		const mainPanel =  (<PuffinElement>document.getElementById('mainpanel'))
		if (!value) {
			sidePanel.style.opacity = '0'
			sidePanel.style.minWidth = '0'
			sidePanel.style.width = '0'
			sidePanel.style.padding = '0'
			sidePanel.style.margin = '0'
		} else {
			sidePanel.style.width = '50%'
			sidePanel.style.opacity = '1'
		}
		sidePanel.update()
		sideBar.update()
		mainPanel.update()
	})
}

function sidebarContext(ev: MouseEvent): void {
	let list: Object[] = []
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
		event: ev,
	})
}

function mountedApp(): void {
	window.addEventListener('load', function () {
		init()
		if (((!isDev && RunningConfig.data.arguments[0] == null) || isDev) && StaticConfig.data.appOpenWelcomeInStartup) {
			Welcome().launch()
		}
	})
}

render(App, document.getElementById('App'))
