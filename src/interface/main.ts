//Renderer process
import { element, render } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'
import TitleBar from './components/titlebar/titlebar'
import SplashScreen from './components/splash.screen'
import init from './defaults/initial'
import Welcome from './defaults/windows/welcome'
import Resizer from './components/resizer'
import StatusBar from './components/status.bar/status.bar'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import ContextMenu from './constructors/contextmenu'
import AppBody from './components/app'
import AppPlatform from 'AppPlatform'
import MainBox from './components/mainbox'
import '../styles/main.scss'

import PuffinElement from './types/puffin.element'
import { ContextMenuButton } from 'Types/contextmenu'

let blurViewApp: boolean = false

const App = element({
	components: {
		TitleBar,
		SplashScreen,
		StatusBar,
		Resizer,
		AppBody,
		MainBox,
	},
})`
  <AppBody mounted="${mountedApp}" class="app-container" os="${AppPlatform}" browser="${RunningConfig.data.isBrowser}">
		<div mounted="${mountedAppView}" style="${handleAppviewState}">
			<TitleBar/>
			<div id="body">
				<div id="sidebar" :contextmenu="${sidebarContext}" style="${handleSidebarState}"/>
				<div id="sidepanel" :resized="${sidePanelResized}" style="${handlesidePanelState}"/>
				<Resizer direction="horizontally"/>
				<div id="mainpanel" blocked="${handleMainpanelState}">
					<div id="panels_stack"></div>
					<Resizer direction="vertically"/>
					<MainBox/>
				</div>
			</div>
			<StatusBar/>
		</div>
		<div id="windows"/>
		<div id="notifications"/>
		<SplashScreen/>
	</AppBody>
`

StaticConfig.keyChanged('appShowTerminal', (value: boolean) => {
	if (!value) {
		document.getElementById('panels_stack').style.height = '100%'
	}
})

function sidePanelResized() {
	RunningConfig.emit('sidePanelHasBeenResized')
}

function handleAppviewState() {
	if (blurViewApp) {
		return `filter: blur(${StaticConfig.data.appBlurEffect}px); transition: 0s;`
	} else {
		return ''
	}
}

function handlesidePanelState(): string {
	if (StaticConfig.data.appEnableSidepanel) {
		return 'display: block'
	} else {
		return 'display: none; min-width:0px; width:0px; padding:0; margin:0;'
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
	const sideBar: PuffinElement = document.getElementById('sidebar')
	const sidePanel: PuffinElement = document.getElementById('sidepanel')
	const mainPanel: PuffinElement = document.getElementById('mainpanel')

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
		sideBar.update()
		mainPanel.update()
	})
	StaticConfig.keyChanged('appEnableSidepanel', value => {
		if (value) {
			sidePanel.style.display = 'block'
		} else {
			sidePanel.style.display = 'none'
		}
		sidePanel.update()
		sideBar.update()
		mainPanel.update()
	})
}

function sidebarContext(ev: MouseEvent): void {
	let list: ContextMenuButton[] = []
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
	window.addEventListener('load', async function () {
		await init()
		const isBrowser = RunningConfig.data.isBrowser
		const isDev = RunningConfig.data.isDev
		const appOpenWelcomeInStartup = StaticConfig.data.appOpenWelcomeInStartup
		/*
		 * Don't show the Welcome Window if:
		 * - It's running in Browser mode
		 * - The app was opened with arguments
		 * - It's configured this way by the user in `appOpenWelcomeInStartup`
		 */
		if (((!isDev && RunningConfig.data.arguments[0] == null) || isDev) && !isBrowser && appOpenWelcomeInStartup) {
			Welcome().launch()
		}
	})
}

render(App, document.getElementById('App'))
