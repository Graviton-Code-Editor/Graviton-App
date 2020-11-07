import { element, style, render, lang } from '@mkenzo_8/puffin'
import { Titles } from '@mkenzo_8/puffin-drac'
import Window from '../../constructors/window'
import SideMenu from '../../components/window/side.menu'
import SideMenuSearcher from '../../components/window/side.menu.searcher'

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
					<div href="advanced">
						${getScheme(
							AdvancedScheme({
								closeWindow: () => SettingsWindow.close(),
							}),
						)}
					</div>
					<div href="shortcuts">
						${getScheme(ShortcutsScheme())}
					</div>
					<div href="languages">
						${getScheme(LanguagesScheme())}
					</div>
					<div href="about">
						${getScheme(AboutScheme())}
					</div>
				</div>
			</SideMenu>
		`
	}
	return SettingsWindow
}
