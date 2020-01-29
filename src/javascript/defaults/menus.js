import Menu from "../constructors/menu";
import SettingsPage from '../defaults/settings'
import Welcome from "./welcome";

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
}

export default loadDefaultMenus