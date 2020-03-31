import {puffin} from '@mkenzo_8/puffin'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import PluginsRegistry from 'PluginsRegistry'

let currentTheme = StaticConfig.data.theme;

StaticConfig.keyChanged('appTheme',function( newTheme ){
	if( currentTheme != newTheme ){
		applyTheme(StaticConfig)
		currentTheme = newTheme
	}
})

const ThemeProvider = new puffin.state({
	splashScreenText:'white',
	splashScreenBackground:'#191919'
})

function applyTheme( state ){
	ThemeProvider.data = PluginsRegistry.registry.data.colorsSchemes[state.data.appTheme]
	ThemeProvider.triggerChange()
}

RunningConfig.on('allPluginsLoaded',function(){
	applyTheme(StaticConfig)
})

export default ThemeProvider