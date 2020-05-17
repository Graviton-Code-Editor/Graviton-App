import { puffin } from '@mkenzo_8/puffin'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import PluginsRegistry from 'PluginsRegistry'

let currentTheme = StaticConfig.data.appTheme

StaticConfig.keyChanged('appTheme', newTheme => {
	if (currentTheme !== newTheme) {
		applyTheme(StaticConfig)
		currentTheme = newTheme
	}
})

const ThemeProvider = new puffin.state({
	splashScreenText: 'white',
	splashScreenBackground: '#191919',
})

const puffinThemingKeys = {
	puffinAccent: 'accentColor',
	puffinTextColor: 'textColor',
	puffinButtonBackground: 'buttonBackground',
	puffinCardBackground: 'cardBackground',
	puffinRadioBackgroundHovering: 'radioBackgroundHovering',
	puffinRadioCircleBackground: 'radioCircleBackground',
	puffinRadioCircleBorder: 'radioCircleBorder',
	puffinRadioCircleBorderHovering: 'radioCircleBorderHovering',
}

const getFallBackProp = prop => PluginsRegistry.registry.data.list.Night.colorsScheme[prop]

function applyTheme(state) {
	ThemeProvider.data = PluginsRegistry.registry.data.colorsSchemes[state.data.appTheme]
	ThemeProvider.triggerChange()
	Object.keys(puffinThemingKeys).forEach(key => {
		const keyValue = puffinThemingKeys[key]
		const valueInTheme = ThemeProvider.data[keyValue] || getFallBackProp(key)
		document.body.style.setProperty(`--${key}`, valueInTheme)
	})
	Object.keys(ThemeProvider.data).forEach(key => {
		const keyValue = ThemeProvider.data[key]
		const valueInTheme = keyValue || getFallBackProp(key)
		document.body.style.setProperty(`--${key}`, valueInTheme)
	})
}
console.log(ThemeProvider)

RunningConfig.on('allPluginsLoaded', () => {
	if (!PluginsRegistry.registry.data.list[StaticConfig.data.appTheme]) {
		StaticConfig.data.appTheme = 'Night'
	}
	applyTheme(StaticConfig)
})

export default ThemeProvider
