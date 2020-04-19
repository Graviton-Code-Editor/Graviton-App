import {puffin} from '@mkenzo_8/puffin'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import PluginsRegistry from 'PluginsRegistry'

let currentTheme = StaticConfig.data.theme;

StaticConfig.keyChanged('appTheme', newTheme => {
	if( currentTheme !== newTheme ){
		applyTheme( StaticConfig )
		currentTheme = newTheme
	}
})

const ThemeProvider = new puffin.state({
	splashScreenText:'white',
	splashScreenBackground:'#191919'
})

const puffinThemingKeys = {
	puffinAccent:'accentColor',
	puffinTextColor:'textColor',
	puffinButtonBackground:'buttonBackground',
	puffinCardBackground: 'cardBackground',
	puffinRadioBackgroundHovering: 'radioBackgroundHovering',
	puffinRadioCircleBackground: 'radioCircleBackground',
	puffinRadioCircleBorder: 'radioCircleBorder',
	puffinRadioCircleBorderHovering: 'radioCircleBorderHovering'
}

function applyTheme( state ){
	ThemeProvider.data = PluginsRegistry.registry.data.colorsSchemes[state.data.appTheme]
	ThemeProvider.triggerChange()
	Object.keys(puffinThemingKeys).forEach( key => {
		const keyValue = puffinThemingKeys[key]
		document.body.style.setProperty(`--${key}`,ThemeProvider.data[keyValue])
	})
	Object.keys(ThemeProvider.data).forEach( key => {
		const keyValue = ThemeProvider.data[key]
		document.body.style.setProperty(`--${key}`,keyValue)
	})
	
}
console.log(ThemeProvider)
RunningConfig.on('allPluginsLoaded', () => applyTheme(StaticConfig) )

export default ThemeProvider