import {puffin} from '@mkenzo_8/puffin'
import StaticConfig from 'StaticConfig'
import Arctic from '../themes/arctic'
import Night from '../themes/night'

StaticConfig.changed(function(){
    applyTheme(StaticConfig)
})

const ThemeProvider = new puffin.state({
    accentColor: "#0066FF",
    bodyBackground:'rgb(238,238,238)',
    titlebarBackground:"rgb(238,238,238)",
    dropmenuBackground:'white',
    dropmenuButtonBackground:"rgb(238,238,238)",
    dropmenuButtonHoveringBackground:"rgb(212,212,212)",
    dropmenuButtonText:"black",
    dropmenuButtonHoveringText:"black",
    dropmenuOptionText:"black",
    dropmenuOptionHoveringText:"white",
    controlButtonsFill:"red",
    controlButtonsHoverBackground:"rgb(212,212,212)",
    controlCloseButtonHoverBackground:"rgba(232,17,35)",
    controlCloseButtonHoverFill:"white",
    windowBackground:'white',
    contextmenuBackground:'white',
    contextmenuButtonBackground:'white',
    contextmenuButtonText:'black',
    contextmenuButtonHoveringBackground:'#0066FF',
    contextmenuButtonHoveringText:'white',
    mainpanelBackground:'white',
    tabBackground:'rgb(238,238,238)',
    tabActiveBackground:'rgb(212,212,212)',
    scrollbarBackground:'rgba(0,0,0,0.2)',
    scrollbarHoverBackground:'rgba(0,0,0,0.5)',
    tabIconStroke:'black',
    tabIconHoverStroke:'gray',
    sidemenuBackground:'rgb(238,238,238)'
})

function applyTheme(state){
    switch(state.data.theme){
        case "Arctic":
            ThemeProvider.data = Arctic
        break;
        case "Night":
            ThemeProvider.data = Night
        break;
    }
    ThemeProvider.triggerChange()
}

applyTheme(StaticConfig)

export default ThemeProvider