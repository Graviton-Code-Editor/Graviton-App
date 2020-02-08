import Menu from "../constructors/menu";
import SettingsPage from './windows/settings'
import Welcome from "./windows/welcome";
import Panel from '../constructors/panel'
import Dialog from '../constructors/dialog'
import ThemeRegistry from 'ThemeRegistry'
import ThemeProvider from 'ThemeProvider'
import Arctic from '../themes/arctic'
import Night from '../themes/night'
import StaticConfig from 'StaticConfig'
import DialogAbout from './dialogs/about'

function loadDefaultMenus(){
    new Menu({ //FILE
         button:'File',
         list:[
            {
                label:'Open File'
            },
            {
                label:'Open Folder'
            }
         ]
     })
    new Menu({ //TOOLS
        button:'Tools',
        list:[
            {
                label:'Open Settings',
                action:()=>SettingsPage().launch()
            },
            {
                label:'Open Welcome',
                action:Welcome.launch
            }
        ]
    })
    new Menu({ //EDITOR
        button:'Editor',
        list:[
            {
                label:'New panel',
                action:()=> new Panel()
            }
        ]
    })
    new Menu({ //HELP
        button:'Help',
        list:[
            {
                label:'About',
                action:DialogAbout
            }
        ]
    })

    new Panel() //Initial Panel

    ThemeRegistry.add(Arctic)    
    ThemeRegistry.add(Night)  

    StaticConfig.triggerChange()

}

export default loadDefaultMenus