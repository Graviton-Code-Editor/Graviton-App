import Menu from "../constructors/menu";
import SettingsPage from './windows/settings'
import Welcome from "./windows/welcome";
import Panel from '../constructors/panel'
import ExtensionsRegistry from 'ExtensionsRegistry'
import Arctic from '../themes/arctic'
import Night from '../themes/night'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import DialogAbout from './dialogs/about'
import { Shortcuts } from 'shortcuts'
import { loadAutomatically } from '../utils/extension.loader'

function init(){

    loadAutomatically()
    
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

    ExtensionsRegistry.add(Arctic)    
    ExtensionsRegistry.add(Night)  

    StaticConfig.triggerChange()

    
    const shortcuts = new Shortcuts ();

    shortcuts.add ([ 
        { shortcut: 'Ctrl+S', handler: event => {
            RunningConfig.data.focusedTab.props.state.data.saved = true
          return true; 
        }}
    ]);

}

export default init