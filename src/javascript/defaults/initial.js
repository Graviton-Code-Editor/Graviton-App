import Menu from "../constructors/menu";
import SettingsPage from './settings'
import Welcome from "./welcome";
import Panel from '../constructors/panel'
import Dialog from '../constructors/dialog'
import GravitonPackage from '../../../package.json'

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
                action:SettingsPage.launch
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
                action:()=> new Dialog({
                    title:'About',
                    content:`Graviton v${GravitonPackage.version}`
                })
            }
        ]
    })

    new Panel() //Initial Panel
}

export default loadDefaultMenus