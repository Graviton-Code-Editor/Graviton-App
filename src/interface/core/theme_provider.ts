import { state } from '@mkenzo_8/puffin'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import PluginsRegistry from 'PluginsRegistry'
import { PuffinState } from 'Types/puffin.state'

let currentTheme = StaticConfig.data.appTheme

StaticConfig.keyChanged('appTheme', (newTheme: string) => {
	if (currentTheme !== newTheme) {
		applyTheme(StaticConfig)
		currentTheme = newTheme
	}
})

const ThemeProvider: PuffinState = new state({
	splashScreenText: 'white',
	splashScreenBackground: '#191919',
})

const puffinThemingKeys = {
	puffinAccent: 'accentColor',
	puffinTextColor: 'textColor',
	puffinButtonText: 'buttonText',
	puffinButtonBackground: 'buttonBackground',
	puffinCardBackground: 'cardBackground',
	puffinRadioBackgroundHovering: 'radioHoveringBackground',
	puffinRadioCircleBackground: 'radioCircleBackground',
	puffinRadioCircleBorder: 'radioCircleBorder',
	puffinRadioCircleBorderHovering: 'radioCircleHoveringBorder',
	puffinInputBackground: 'inputBackground',
	puffinInputBorder: 'inputBorder',
}

const getFallBackProp = (prop: string) => getProperty(prop, PluginsRegistry.registry.data.list.Night.colorsScheme)

function applyTheme(state: PuffinState) {
	const themeSchema = PluginsRegistry.registry.data.colorsSchemes.Night //Use Night theme as schema
	ThemeProvider.data = PluginsRegistry.registry.data.colorsSchemes[state.data.appTheme]
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

RunningConfig.on('allPluginsLoaded', () => {
	if (!PluginsRegistry.registry.data.list[StaticConfig.data.appTheme]) {
		StaticConfig.data.appTheme = 'Night'
	}
	applyTheme(StaticConfig)
})

function getProperty(key: string, keys: string[]): string {
	let lastKey: string
	let lastKeyValue: string[]
	let res: string
	if (!keys[key]) {
		key
			.replace(/([a-z](?=[A-Z]))/g, '$1 ')
			.split(' ')
			.forEach((k: string, i: number, total: string[]) => {
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

function setProperty(key: string, keyValue: string, name = ''): void {
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
