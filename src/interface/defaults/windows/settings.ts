import { element, style, render, lang } from '@mkenzo_8/puffin'
import { Titles } from '@mkenzo_8/puffin-drac'
import Window from '../../constructors/window'
import SideMenu from '../../components/window/side.menu'
import SideMenuSearcher from '../../components/window/side.menu.searcher'

import CustomizationPage from '../settings/pages/customization'
import AdvancedPage from '../settings/pages/advanced'
import LanguagesPage from '../settings/pages/languages'
import AboutPage from '../settings/pages/about'

import { WindowInstance } from 'Types/window'

export default function Settings(): WindowInstance {
	const SettingsWindow = new Window({
		title: 'settings',
		component: SettingsPage,
	})

	function SettingsPage() {
		return element({
			components: {
				H1: Titles.h1,
				SideMenu,
				SideMenuSearcher,
				CustomizationPage,
				AdvancedPage,
				LanguagesPage,
				AboutPage,
			},
		})`
			<SideMenu default="customization">
				<div>
					<H1 lang-string="windows.Settings.Settings"/>
					<SideMenuSearcher/>
					<label to="customization" lang-string="windows.Settings.Customization.Customization"/>
					<label to="advanced" lang-string="windows.Settings.Advanced.Advanced"/>
					<label to="languages" lang-string="windows.Settings.Languages"/>
					<label to="about" lang-string="windows.Settings.About.About"/>
				</div>
				<div>
					<CustomizationPage/>
					<AdvancedPage closeWindow="${() => SettingsWindow.close()}"/>
					<LanguagesPage/>
					<AboutPage/>
				</div>
			</SideMenu>
		`
	}
	return SettingsWindow
}
