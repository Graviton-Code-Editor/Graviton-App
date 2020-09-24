import { element, style, render, lang } from '@mkenzo_8/puffin'
import { Titles, RadioGroup, Card } from '@mkenzo_8/puffin-drac'
import PluginsRegistry from 'PluginsRegistry'
import StaticConfig from 'StaticConfig'

import ThemeCard from '../../../components/settings/theme.card'
import IconpackCard from '../../../components/settings/iconpack.card'

import { PuffinComponent } from 'Types/puffin.component'

export default function CustomizationPage(): PuffinComponent {
	const pluginsList = PluginsRegistry.registry.data.list

	return element({
		components: {
			RadioGroup,
			H4: Titles.h4,
		},
	})`
		<div href="customization">
			<div href="themes">
				<div style="overflow:auto; height: auto; padding: 3px 0;">
					<H4 lang-string="windows.Settings.Customization.Themes"/>
					<RadioGroup :radioSelected="${selectedTheme}" direction="vertically" styled="false">
						${Object.keys(pluginsList)
							.map(pluginName => {
								const pluginInfo = pluginsList[pluginName]
								if (pluginInfo.type === 'theme') {
									return element({
										components: {
											ThemeCard,
										},
									})`
									<label styled="false" hidden-radio="true" name="${pluginName}" checked="${StaticConfig.data.appTheme == pluginName}">
										<ThemeCard themeInfo="${pluginInfo}"/>
									</label>
								`
								}
							})
							.filter(Boolean)}
					</RadioGroup>
				</div>
			</div>  
			<div href="iconpacks">
				<div style="overflow:auto; height: auto; padding: 3px 0;">
					<H4 lang-string="windows.Settings.Customization.Iconpacks"/>
					<RadioGroup :radioSelected="${selectedIconpack}" direction="vertically" styled="false">
						${Object.keys(pluginsList)
							.map(pluginName => {
								const pluginInfo = pluginsList[pluginName]
								if (pluginInfo.type === 'iconpack') {
									return element({
										components: {
											IconpackCard,
										},
									})`
									<label styled="false" hidden-radio="true" name="${pluginName}" checked="${StaticConfig.data.appIconpack == pluginName}">
										<IconpackCard iconpackInfo="${pluginInfo}"/>
									</label>
								`
								}
							})
							.filter(Boolean)}
					</RadioGroup>
				</div>
			</div>
		</div>
	`
}

function selectedTheme(e): void {
	const newTheme = e.detail.target.getAttribute('name')
	if (StaticConfig.data.appTheme != newTheme) StaticConfig.data.appTheme = newTheme
}
function selectedIconpack(e): void {
	const newIconpack = e.detail.target.getAttribute('name')
	if (StaticConfig.data.appIconpack != newIconpack) StaticConfig.data.appIconpack = newIconpack
}
