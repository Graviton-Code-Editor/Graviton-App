import {puffin} from '@mkenzo_8/puffin'
import StaticConfig from 'StaticConfig'
import ThemeRegistry from 'ThemeRegistry'

StaticConfig.changed(function(){
    applyTheme(StaticConfig)
})

const ThemeProvider = new puffin.state({})

function applyTheme(state){
    ThemeProvider.data = ThemeRegistry.registry.data.colorsSchemes[state.data.theme]
    ThemeProvider.triggerChange()
}

export default ThemeProvider