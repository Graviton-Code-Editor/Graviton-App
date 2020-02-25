import { openWorkspace, addFolderToWorkspace } from '../utils/filesystem'
import { Panel, removePanel } from '../constructors/panel'
import { Shortcuts } from 'shortcuts'
import { loadAutomatically } from '../utils/extension.loader'
import Menu from "../constructors/menu";
import Settings from './windows/settings'
import Welcome from "./windows/welcome";
import ExtensionsRegistry from 'ExtensionsRegistry'
import Arctic from '../themes/arctic'
import Night from '../themes/night'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import About from './dialogs/about'
import CommandPrompt from '../constructors/command.prompt'


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
            },
            {},
            {
                label:'Open workspace',
                action:()=>{
                    RunningConfig.emit('openWorkspaceDialog')
                }
            },
            {
                label:'Add folder to workspace',
                action:()=>{
                    RunningConfig.emit('addFolderToRunningWorkspaceDialog',{
                        replaceOldExplorer:false
                    })
                }
            },
            {
                label:'Save workspace',
                action:()=>{
                    RunningConfig.emit('saveCurrentWorkspace')
                }
            }
         ]
     })
    new Menu({ //TOOLS
        button:'Tools',
        list:[
            {
                label:'Open Settings',
                action:()=>Settings().launch()
            },
            {
                label:'Open Welcome',
                action:()=>Welcome().launch()
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
                action:()=>About().launch()
            }
        ]
    })

    new Panel() //Initial Panel

    ExtensionsRegistry.add(Arctic)    
    ExtensionsRegistry.add(Night)  
    
    const shortcuts = new Shortcuts ();

    shortcuts.add ([ 
        { 
            shortcut: 'Ctrl+S', handler: event => {
                RunningConfig.data.focusedTab.props.state.emit('savedMe')
                return true; 
            }
        },
        { 
            shortcut: 'Ctrl+N', handler: event => {
                new Panel()
            }
        },
        { 
            shortcut: 'Ctrl+L', handler: event => {
                removePanel()
            }
        },
        { 
            shortcut: 'Ctrl+P', handler: event => {
                new CommandPrompt({
                    name:'global',
                    showInput:true,
                    inputPlaceHolder:'Enter a command',
                    options:[
                        {
                            label:'Open Settings'
                        },{
                            label:'Open Projects'
                        },{
                            label:'Open Workspaces'
                        },{
                            label:'Open About'
                        },{
                            label:'Set theme'
                        },
                        ...RunningConfig.data.globalCommandPrompt
                    ],
                    onSelected(res){
                        switch(res.label){
                            case 'Open Settings':
                                Settings().launch()
                            break;
                            case 'Open Projects':
                                Welcome().launch()
                            break;
                            case 'Open Workspaces':
                                Welcome({
                                    defaultPage : 'workspaces'
                                }).launch()
                            break;
                            case 'Open About':
                                About().launch()
                            break;
                            case 'Set theme':
                                const configuredTheme = StaticConfig.data.theme

                                new CommandPrompt({
                                    showInput:true,
                                    inputPlaceHolder:'Enter a command',
                                    options:(function(){
                                        const list = []
                                        const registry = ExtensionsRegistry.registry.data.list
                                        Object.keys(registry).filter(function(name){
                                            const extension = registry[name]
                                            if(extension.type == "theme"){
                                                list.push({
                                                    label:name,
                                                    selected:configuredTheme == name
                                                })
                                            }
                                        })
                                        return list;
                                    })(),
                                    onSelected(res){
                                        StaticConfig.data.theme = res.label
                                    },
                                    onScrolled(res){
                                        StaticConfig.data.theme = res.label
                                    }
                                })
                            break;
                        }
                    }
                })
            }
        }
    ]);

    RunningConfig.emit('appLoaded')
}

export default init