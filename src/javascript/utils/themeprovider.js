import { state } from '@mkenzo_8/puffin'
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

const ThemeProvider = new state({
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

const getFallBackProp = prop => getProperty(prop, PluginsRegistry.registry.data.list.Night.colorsScheme)

function applyTheme(state) {
	ThemeProvider.data = PluginsRegistry.registry.data.colorsSchemes[state.data.appTheme]
	const themeSchema = PluginsRegistry.registry.data.colorsSchemes.Night
	ThemeProvider.triggerChange()
	Object.keys(puffinThemingKeys).forEach(key => {
		const keyValue = puffinThemingKeys[key]
		const valueInTheme = getProperty(keyValue, ThemeProvider.data) || getFallBackProp(key)
		document.body.style.setProperty(`--${key}`, valueInTheme)
	})
	Object.keys(themeSchema).forEach(key => {
		const keyValue = getProperty(key, ThemeProvider.data)
		const valueInTheme = keyValue || getFallBackProp(key)
		setProperty(key, valueInTheme, key)
	})
}
console.log(ThemeProvider)

RunningConfig.on('allPluginsLoaded', () => {
	if (!PluginsRegistry.registry.data.list[StaticConfig.data.appTheme]) {
		StaticConfig.data.appTheme = 'Night'
	}
	applyTheme(StaticConfig)
})

function getProperty(key, keys) {
	let lastKey
	let lastKeyValue
	let res
	if (!keys[key]) {
		key
			.replace(/([a-z](?=[A-Z]))/g, '$1 ')
			.split(' ')
			.forEach((k, i, total) => {
				if (i == 0) {
					lastKey = k
					if (!keys[lastKey]) keys[lastKey] = {}
					lastKeyValue = keys
				} else {
					if (i == total.length - 1) {
						res = lastKeyValue[lastKey][k]
					} else {
						if (!lastKeyValue[lastKey][k]) lastKeyValue[lastKey][k] = {}
						lastKeyValue = lastKeyValue[lastKey]
						lastKey = k
					}
				}
			})
	} else {
		res = keys[key]
	}
	return res
}

const setProperty = (key, keyValue, name = '') => {
	if (typeof keyValue === 'object') {
		Object.keys(keyValue).map(subKey => {
			const subKeyValue = keyValue[subKey]
			const newName = `${name}${subKey}`
			if (typeof subKeyValue === 'string') {
				document.body.style.setProperty(`--${newName}`, subKeyValue)
			} else {
				setProperty(subKey, subKeyValue, newName)
			}
		})
	} else {
		document.body.style.setProperty(`--${key}`, keyValue)
	}
}

export { ThemeProvider, getProperty }
