import { element, style, render, lang } from '@mkenzo_8/puffin'
import { Titles } from '@mkenzo_8/puffin-drac'
import Window from '../../constructors/window'
import SideMenu from '../../components/window/side.menu'
import SideMenuSearcher from '../../components/window/side.menu.searcher'
import SideMenuPage from '../../components/window/side_menu_page'

import CustomizationScheme from '../settings/pages/customization'
import AdvancedScheme from '../settings/pages/advanced'
import ShortcutsScheme from '../settings/pages/shortcuts'
import LanguagesScheme from '../settings/pages/languages'
import AboutScheme from '../settings/pages/about'

import getScheme from '../../utils/get_scheme'

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
				SideMenuPage,
			},
		})`
			<SideMenu default="customization">
				<div>
					<H1 lang-string="windows.Settings.Settings"/>
					<SideMenuSearcher/>
					<label to="customization" lang-string="windows.Settings.Customization.Customization"/>
					<label to="advanced" lang-string="windows.Settings.Advanced.Advanced"/>
					<label to="shortcuts" lang-string="windows.Settings.Shortcuts.Shortcuts"/>
					<label to="languages" lang-string="windows.Settings.Languages"/>
					<label to="about" lang-string="windows.Settings.About.About"/>
				</div>
				<div>
					<div href="customization">
						${getScheme(CustomizationScheme())}
					</div>
					<SideMenuPage href="advanced" component="${getScheme(
						AdvancedScheme({
							closeWindow: () => SettingsWindow.close(),
						}),
					)}"/>
					<SideMenuPage href="shortcuts" component="${getScheme(ShortcutsScheme())}"/>
					<SideMenuPage href="languages" component="${getScheme(LanguagesScheme())}"/>
					<SideMenuPage href="about" component="${getScheme(AboutScheme())}"/>
				</div>
			</SideMenu>
		`
	}
	return SettingsWindow
}
