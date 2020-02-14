import {puffin} from '@mkenzo_8/puffin'
import StaticConfig from 'StaticConfig'
import ExtensionsRegistry from 'ExtensionsRegistry'

StaticConfig.changed(function(){
    applyTheme(StaticConfig)
})

const ThemeProvider = new puffin.state({})

function applyTheme(state){
    ThemeProvider.data = ExtensionsRegistry.registry.data.colorsSchemes[state.data.theme]
    ThemeProvider.triggerChange()
}

export default ThemeProvider