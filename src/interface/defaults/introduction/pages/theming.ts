import { element, lang } from '@mkenzo_8/puffin'
import { Titles } from '@mkenzo_8/puffin-drac'
import IntroductionPage from '../../../components/introduction/slider_page'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import ThemeCard from '../../../components/settings/theme.card'
import PluginsRegistry from 'PluginsRegistry'
import { LanguageState } from 'LanguageConfig'

export default function Theming() {
	const pluginsList = PluginsRegistry.registry.data.list

	const NightInfo = pluginsList['Night']
	const ArcticInfo = pluginsList['Arctic']

	const setTheme = (theme: string) => (StaticConfig.data.appTheme = theme)

	return element({
		addons: [lang(LanguageState)],
		components: {
			ThemeCard,
			Title: Titles.h2,
			IntroductionPage,
		},
	})`
	<IntroductionPage>
		<Title class="title" lang-string="windows.Introduction.Theming.SelectATheme"/>
		<div class="theme_cards">
			<ThemeCard :click="${() => setTheme('Night')}" info="${NightInfo}"/>
			<ThemeCard :click="${() => setTheme('Arctic')}" info="${ArcticInfo}"/>
		</div>
	</IntroductionPage>
	`
}
