import {puffin} from '@mkenzo_8/puffin'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import ExtensionsRegistry from 'ExtensionsRegistry'

let currentTheme;

StaticConfig.changed(function(){
    if(currentTheme !=StaticConfig.data.theme){
        applyTheme(StaticConfig)
        currentTheme = StaticConfig.data.theme
    }
})

const ThemeProvider = new puffin.state({})

function applyTheme(state){
    ThemeProvider.data = ExtensionsRegistry.registry.data.colorsSchemes[state.data.theme]
    ThemeProvider.triggerChange()
}

RunningConfig.on('allExtensionsLoaded',function(){
    applyTheme(StaticConfig)
})


export default ThemeProvider