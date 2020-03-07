import { Panel, removePanel } from '../constructors/panel'
import { Shortcuts } from 'shortcuts'
import { loadAutomatically } from '../utils/extension.loader'
import { puffin } from '@mkenzo_8/puffin'
import { openFolder } from '../utils/filesystem'
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
import Languages from '../../../languages/*.json'
import StatusBarItem from '../constructors/status.bar.item'
import requirePath from '../utils/require'
import ThemeProvider from '../utils/themeprovider';
import Plus from '../components/icons/plus'
import Minus from '../components/icons/minus'

const { openExternal: openLink } = requirePath("electron").shell
const { getCurrentWindow } = requirePath("electron").remote

function init(){
    loadAutomatically()
    
    new Menu({ //FILE
         button:'File',
         list:[
            {
                label:'Open File'
            },
            {
                label:'Open Folder',
             	action:()=>{
                  openFolder().then(function(folderPath){
                    RunningConfig.emit('addFolderToRunningWorkspace',{
                        folderPath,
                        replaceOldExplorer:true,
                        workspacePath:null
                    })
                    WelcomeWindow.close()
                  })
                }
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
    new Menu({ //Window
        button:'Window',
        list:[
            {
                label:'Default zoom',
                action:()=> {
                    StaticConfig.data.zoom = 1
                    StaticConfig.emit('setZoom',StaticConfig.data.zoom)
                }
            },
            {
                label:'Increase zoom',
                action:()=> {
                    StaticConfig.data.zoom += 0.1
                    StaticConfig.emit('setZoom',StaticConfig.data.zoom)
                }
            },
            {
                label:'Decrease zoom',
                action:()=> {
                    StaticConfig.data.zoom -= 0.1
                    StaticConfig.emit('setZoom',StaticConfig.data.zoom)
                }
            },
            {
                label:'Open dev tools',
                action:()=> {
                   getCurrentWindow().toggleDevTools();
                }
            }
        ]
    })
    new Menu({ //HELP
        button:'Help',
        list:[
            {
                label:'Blog',
                action:()=>{
                    openLink('https://graviton.ml/blog/')
                }
            },{
                label:'Website',
                action:()=>{
                    openLink('https://graviton.ml/')
                }
            },
            {
                label:'About',
                action:()=>About().launch()
            }
        ]
    })

    new Panel() //Initial Panel

    new StatusBarItem({
        component:Plus,
        position:'right',
        action:()=>{
            StaticConfig.data.zoom += 0.1
                    StaticConfig.emit('setZoom',StaticConfig.data.zoom)
        }
    })

    new StatusBarItem({
        component:Minus,
        position:'right',
        action:()=>{
            StaticConfig.data.zoom -= 0.1
                    StaticConfig.emit('setZoom',StaticConfig.data.zoom)
        }
    })

    ExtensionsRegistry.add(Arctic)    
    ExtensionsRegistry.add(Night)  
    
    const shortcuts = new Shortcuts ();

    shortcuts.add ([ 
        { 
            shortcut: 'Ctrl+S', handler: event => {
                if( RunningConfig.data.focusedTab != null ) { //Check if there is any opened tab
                    RunningConfig.data.focusedTab.props.state.emit('savedMe')
                }
            }
        },
        { 
            shortcut: 'Ctrl+N', handler: event => {
                new Panel()
            }
        },
        { 
            shortcut: 'Ctrl+T', handler: event => {
                console.log("working")
                if( RunningConfig.data.focusedTab != null ) { //Check if there is any opened tab
                    RunningConfig.data.focusedTab.props.state.emit('close')
                }
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
                        },{
                            label:'Set Language'
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
                                    inputPlaceHolder:'Select a theme',
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
                            case 'Set Language':
                                const configuredLanguage = StaticConfig.data.language

                                new CommandPrompt({
                                    showInput:true,
                                    inputPlaceHolder:'Select a language',
                                    options:(function(){
                                        const list = []
                                        Object.keys(Languages).filter(function(name){
                                            list.push({
                                                label:name,
                                                selected:configuredLanguage == name
                                            })
                                        })
                                        return list;
                                    })(),
                                    onSelected(res){
                                        StaticConfig.data.language = res.label
                                    },
                                    onScrolled(res){
                                        StaticConfig.data.language = res.label
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