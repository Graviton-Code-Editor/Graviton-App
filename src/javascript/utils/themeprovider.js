import {puffin} from '@mkenzo_8/puffin'

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
    controlButtonsFill:"black",
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
    scrollbarBackground:'rgb(238,238,238)',
    scrollbarHoverBackground:'rgb(212,212,212)'
})

export default ThemeProvider