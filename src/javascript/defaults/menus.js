import Menu from "../constructors/menu";
import SettingsPage from '../defaults/settings'
import Welcome from "./welcome";
import Panel from '../constructors/panel'
import Dialog from '../constructors/dialog'

function loadDefaultMenus(){
    new Menu({
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
    new Menu({
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
    new Menu({
        button:'Editor',
        list:[
            {
                label:'New panel',
                action:()=> new Panel()
            }
        ]
    })
    new Menu({
        button:'Help',
        list:[
            {
                label:'About',
                action:()=> new Dialog({
                    title:'About',
                    content:'Graviton v2'
                })
            }
        ]
    })
}

export default loadDefaultMenus