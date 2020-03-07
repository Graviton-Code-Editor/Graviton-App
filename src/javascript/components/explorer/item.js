import { puffin } from '@mkenzo_8/puffin'
import Explorer from '../../constructors/explorer'
import ContextMenu from '../../constructors/contextmenu'
import Tab from '../../constructors/tab'
import Editor from '../../constructors/editor'
import newDirectoryDialog from '../../defaults/dialogs/new.directory'
import areYouSureDialog from '../../defaults/dialogs/you.sure'
import StaticConfig from 'StaticConfig'
import ExtensionsRegistry from 'ExtensionsRegistry'
import RunningConfig from 'RunningConfig'
import Icons from '../../../../assets/icons/**.svg'
import FolderArrow from '../icons/folder.arrow'
import requirePath from '../../utils/require'

const fs = requirePath("fs-extra")
const trash = requirePath("trash")
const path = requirePath("path")

function getMyStatus(filePath,gitChanges,projectPath){
    const supportedGitStatuses = ["not_added","modified"]
    let result = {
        status:'unknown'
    }
    if(gitChanges){
        supportedGitStatuses.map((status)=>{
            gitChanges[status].filter((gitPath)=>{
                if( path.normalize(path.resolve(projectPath,gitPath)) == path.normalize(filePath) ){
                    return result = {
                        status:status
                    }
                }else{
                    const dirsGit =  path.normalize(gitPath).split(path.sep)
                    const dirsLocal = path.normalize(filePath).split(path.sep)
                    dirsGit.map((dirGit)=>{
                        const dirLocal = dirsLocal[dirsLocal.length-1]
                        if(dirLocal == dirGit){
                            if(gitPath.match(dirGit))
                            return result = {
                                status:status
                            }
                        }
                    })
                }
            })
        }) 
    }
    return result
}

function markStatus(target,status){
    const spanText = target.children[0].children[2]
    const isDirectory = target.getAttribute("isDirectory") == "true"

    switch(status){
        case 'modified':
            target.setAttribute('gitStatus','modified')
            if( !isDirectory) spanText.textContent = `${spanText.getAttribute("originalName")} - M`
        break;
        case 'not_added': //Same as untracked
            target.setAttribute('gitStatus','not_added')
            if( !isDirectory) spanText.textContent = `${spanText.getAttribute("originalName")} - U`
        break;
      default:
        target.setAttribute('gitStatus',null)
      	if( !isDirectory) spanText.textContent = spanText.getAttribute("originalName")
    }
}

function Item(){
    const ItemWrapper = puffin.style.div`
        &{
            background:transparent;
            white-space:nowrap;
            padding:0px;
            user-select:none;
        }
        & > button{
            transition:0.07s;
            margin:0;
            border-radius:12px;
            font-size:12px;
            padding:3px 5px;
            border:none;
            margin:0px;
            background:transparent;
            outline:0;
            white-space:nowrap;
            display:flex;
            align-items: center;
            justify-content: center;
            color:var(--explorerItemText);
        }
        & button:hover{
            transition:0.07s;
            background:rgba(150,150,150,0.6);
            border-radius:5px;
        }
        & > button > *{
            align-items: center;
            display:flex;
            color:var(--explorerItemText);
        }
        & .gitStatus {
            display:none;
            position:relative;
            padding:3px;
            border-radius:50px;
            margin: auto 2px;
            margin-left:6px;
        }

        &[gitStatus="modified"][isDirectory="true"] > button > .gitStatus {
            display:block;
            background:var(--explorerItemGitModifiedIndicator);
        }
        &[gitStatus="modified"] > button > span {
            color:var(--explorerItemGitModifiedIndicator);
        }

        &[gitStatus="not_added"][isDirectory="true"] > button > .gitStatus {
            display:block;
            background:var(--explorerItemGitNotAddedIndicator);
        }
        &[gitStatus="not_added"] > button > span {
            color:var(--explorerItemGitNotAddedText);
        }
        & .icon{
            height:20px;
            width:20px;
            margin-right:4px;
            position:relative;
        }
        & .arrow{
            height:8px;
            width:8px;
            position:relative;
            padding:0px;
            margin-right:3px;
            transition:0.1s;
            border-radius:1px;
        }
        &[opened="true"] .arrow{
           transform:rotate(90deg);
        }
        &[opened="false"] .arrow{
            transform:rotate(0deg);
        }

    `

    const ItemComp = puffin.element(`
        <ItemWrapper>
            <button click="$openDirectory" contextmenu="$contextMenu">
                <FolderArrow class="arrow"/>
                <img class="icon"/>
                <span originalName="{{path}}">{{path}}</span>
                <div class="gitStatus"/>
            </button>
        </ItemWrapper>
    `,{
        props:['path'],
        components:{
            ItemWrapper,
            FolderArrow
        },
        methods:{
            openDirectory(e){
                this.parentElement.state.emit('clickItem')
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
                const itemState = new puffin.state({})
                const fileExtension = getExtension(target)
                const itemIcon = target.getElementsByClassName('icon')[0]
                const itemArrow = target.getElementsByClassName('arrow')[0]
                const gitStatus = target.getAttribute("git-status") ||true
                const gitChanges = target.parentElement.parentElement.gitChanges
                target.gitChanges = gitChanges

                target.state = itemState
                target.style.paddingLeft = `${Number(target.getAttribute("level"))+6}px`

                if(target.getAttribute("isDirectory") == "true"){
                    setStateClosed(target)

                }else{
                    setFileIcon(itemIcon,fileExtension)
                    itemArrow.style.opacity = "0"

                }
                const gitResult = getMyStatus(
                    target.getAttribute("fullpath"),
                    gitChanges,
                    target.getAttribute("parentfolder")
                )
                markStatus(target,gitResult.status)
              
			    RunningConfig.on('gitStatusUpdated',({ gitChanges })=>{
                  target.gitChanges = gitChanges
                  const gitResult = getMyStatus(
                    this.getAttribute("fullpath"),
                    gitChanges,
                    this.getAttribute("parentfolder")
                  )
                  markStatus(this,gitResult.status)
                })
                target.state.on('clickItem',function(){

                    if(target.getAttribute("isDirectory") == "true"){
                        const itemContainer = target.children[1]

                        if(itemContainer == null){
                            new Explorer(target.getAttribute("fullpath"),target,Number(target.getAttribute("level"))+1,gitChanges)
                            setStateOpen(target)
                        }else{
                            itemContainer.remove()
                            setStateClosed(target)
                        }

                    }else{
                        const basename = path.basename(target.getAttribute("fullpath"))
                        const fileExtension = getExtension(target)
                        
                        const { bodyElement, tabElement, tabState, isCancelled } = new Tab({
                            title:basename,
                            directory:target.getAttribute("fullpath"),
                            parentFolder:target.getAttribute("parentFolder")
                        })

                        if(isCancelled) return; //Cancels the tab opening

                        fs.readFile(target.getAttribute("fullpath"),'UTF-8').then(function(data){
                            new Editor({
                                language:fileExtension,
                                value:data ,
                                theme:ExtensionsRegistry.registry.data.list[StaticConfig.data.theme].textTheme,
                                bodyElement,
                                tabElement,
                                tabState,
                                directory:target.getAttribute("fullpath")
                            })
                        })

                    }
                })

                target.state.on('doReload',function(){
                    reload(target,gitChanges)
                })

            }
        }
    })
    return ItemComp
}

function reload(target,gitChanges){
    if(target.children[1] != null) target.children[1].remove()
    new Explorer(target.getAttribute("fullpath"),target,Number(target.getAttribute("level"))+1,gitChanges)
    setStateOpen(target)
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

function setStateOpen(target){
    const itemIcon = target.getElementsByClassName('icon')[0]
    itemIcon.src = Icons["folder.opened"]
    target.setAttribute('opened','true')
}

function setStateClosed(target){
    const itemIcon = target.getElementsByClassName('icon')[0]
    itemIcon.src = Icons["folder.closed"]
    target.setAttribute('opened','false')
}

function removeDirectoryOrFile(element){
    areYouSureDialog().then(function(){
        trash([element.parentElement.getAttribute("fullpath")]).then(function(){
            element.parentElement.parentElement.parentElement.state.emit('doReload')
        });        
    }).catch(function(err){
        //Clicked "No"
    })
}

export default Item