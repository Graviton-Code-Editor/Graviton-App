import { puffin } from '@mkenzo_8/puffin'
import Explorer from '../../constructors/explorer'
import ContextMenu from '../../constructors/contextmenu'
import Tab from '../../constructors/tab'
import Editor from '../../constructors/editor'
import path from 'path'
import newDirectoryDialog from '../../defaults/dialogs/new.directory'
import areYouSureDialog from '../../defaults/dialogs/you.sure'
import StaticConfig from 'StaticConfig'
import ExtensionsRegistry from 'ExtensionsRegistry'

import ThemeProvider from 'ThemeProvider'
import Icons from '../../../../assets/icons/**.svg'

import requirePath from '../../utils/require'
const fs = requirePath("fs-extra");
const trash = requirePath("trash")

function Item(){
    const ItemWrapper = puffin.style.div`
        ${ThemeProvider}
        &{
            background:transparent;
            white-space:nowrap;
            padding:0px;

        }
        & button{
            margin:0;
            border-radius:5px;
            font-size:13px;
            transition:0.05s;
            padding:3px 5px;
            border:none;
            margin:0px;
            background:transparent;
            outline:0;
            white-space:nowrap;
            display:flex;
            align-items: center;
            justify-content: center;
            color:{{explorerItemText}};
        }
        & button *{
            align-items: center;
            display:flex;
            color:{{explorerItemText}};
        }
        & button:hover{
            background:rgba(150,150,150,0.6);
            transition:0.05s;
        }
        & .icon{
            height:20px;
            width:20px;
            margin-right:4px;
            position:relative;
        }

    `

    const ItemComp = puffin.element(`
        <ItemWrapper>
            <button click="$openDirectory" contextmenu="$contextMenu">
                <img class="icon"/>
                <span>{{path}}</span>
            </button>
        </ItemWrapper>
    `,{
        props:['path'],
        components:{
            ItemWrapper
        },
        methods:{
            openDirectory(e){
                if(this.parentElement.getAttribute("isDirectory") == "true"){
                    if(this.parentElement.children[1] == null){
                        new Explorer(this.parentElement.getAttribute("fullpath"),this.parentElement,Number(this.parentElement.getAttribute("level"))+1)
                        setOpenIcon(this.parentElement.children[0].children[0])
                    }else{
                        this.parentElement.children[1].remove()
                        setClosedIcon(this.parentElement.children[0].children[0])
                    }
                }else{
                    const basename = path.basename(this.parentElement.getAttribute("fullpath"))
                    const fileExtension = getExtension(this.parentElement)
                    
                    const { bodyElement, tabElement, panel, isCancelled } = new Tab({
                        title:basename,
                        directory:this.parentElement.getAttribute("fullpath")
                    })

                    if(isCancelled) return; //Cancels the tab opening

                    fs.readFile(this.parentElement.getAttribute("fullpath"),'UTF-8').then(function(data){
                        new Editor({
                            language:fileExtension,
                            value:data ,
                            theme:ExtensionsRegistry.registry.data.list[StaticConfig.data.theme].textTheme,
                            bodyElement,
                            tabElement,
                            panel
                        })
                    })

                }
            },
            contextMenu(e){
                if(this.parentElement.getAttribute("isDirectory") == "true"){
                    new ContextMenu({
                        list:[
                            {
                                label:"New folder",
                                action:()=>{
                                    newDirectoryDialog({
                                        isFolder:true,
                                        parentDirectory:this.parentElement.getAttribute("fullpath"),
                                        explorerContainer:this.parentElement
                                    })
                                }
                            },
                            {
                                label:"New file",
                                action:()=>{
                                    newDirectoryDialog({
                                        isFolder:false,
                                        parentDirectory:this.parentElement.getAttribute("fullpath"),
                                        explorerContainer:this.parentElement
                                    })
                                }
                            },
                            {},
                            {
                                label:"Remove folder",
                                action:()=>{
                                    if(this.parentElement.getAttribute("level")!="0"){
                                        removeDirectoryOrFile(this)
                                    } 
                                }
                            }

                        ],
                        parent:this,
                        event:e
                    })
                }else{
                    new ContextMenu({
                        list:[
                            {
                                label:"Remove file",
                                action:()=>{
                                    removeDirectoryOrFile(this)
                                }
                            }

                        ],
                        parent:this,
                        event:e
                    })
                }
            }
        },
        events:{
            mounted(target){

                const fileExtension = getExtension(target)

                target.children[0].children[1].textContent = target.props.path //FIX

                target.style.paddingLeft = `${Number(target.getAttribute("level"))+6}px`

                if(target.getAttribute("isDirectory") == "true"){
                    setClosedIcon(target.children[0].children[0])
                }else{
                    setFileIcon(target.children[0].children[0],fileExtension)
                }

                target.reload = ()=> reload(target)
                
            }
        }
    })
    return ItemComp
}

function reload(target){
    if(target.children[1] != null) target.children[1].remove()
    new Explorer(target.getAttribute("fullpath"),target,Number(target.getAttribute("level"))+1)
    setOpenIcon(target.children[0].children[0])
}

function getExtension(target){
    return path.basename(target.getAttribute("fullpath")).split('.')[path.basename(target.getAttribute("fullpath")).split('.').length-1]
}

function setFileIcon(target,extension){
    if(Icons[`${extension}.lang`] !== undefined){
        target.src = Icons[`${extension}.lang`] 
    }else{
        target.src = Icons['unknown.file'] 
    }     
}

function setOpenIcon(target){
    target.src = Icons["folder.opened"]
}

function setClosedIcon(target){
    target.src = Icons["folder.closed"]
}

function removeDirectoryOrFile(element){
    areYouSureDialog().then(function(){
        trash([element.parentElement.getAttribute("fullpath")]).then(function(){
            element.parentElement.parentElement.parentElement.reload()
        });        
    }).catch(function(err){
        //Clicked "No"
    })
}

export default Item