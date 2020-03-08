import TabBody from '../components/panel/tab'
import TabEditor from '../components/panel/tab.editor'
import {puffin} from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import Cross from '../components/icons/cross'
import UnSavedIcon from '../components/icons/file.not.saved'
import requirePath from '../utils/require'

function guessTabPosition(tab,tabsbar){
    const res =Object.keys(tabsbar.children).filter((tabChildren,index)=>{
        if( tabsbar.children[tabChildren] == tab ){
            return tabChildren
        }
    })[0]
    return Number(res)
}


const fs = requirePath("fs-extra")

function Tab({
    title,
    isEditor,
    directory,
    parentFolder,
    component,
    panel = RunningConfig.data.focusedPanel
}){
    const tabState = new puffin.state({
        active:true,
        saved:true,
        parentFolder,
        panel
    })

    const classSelector = `${directory}`

    if( document.getElementsByClassName(classSelector).length >= 1 ){
        /**
         *  Tab already exists so it won't be rendered again
         */
        return {
            isCancelled : true
        }
    }

    const TabComp = puffin.element(`
        <TabBody draggable="true" 
            classSelector="${classSelector}" 
            class="${classSelector}" 
            dragstart="$startDrag" 
            click="$focusTab" 
            active="{{active}}" 
            mouseover="$showCross" 
            mouseleave="$hideCross">
            <p classSelector="${classSelector}">
                ${title}
            </p>
            <div classSelector="${classSelector}">
                <Cross classSelector="${classSelector}" style="opacity:0;" click="$closeTab"/>
            </div>
        </TabBody>
    `,{
        components:{
            TabBody,
            Cross
        },
        methods:{
            startDrag(e){
                event.dataTransfer.setData("classSelector", classSelector)

                const tabsBar = this.parentElement
                const tabPosition  = guessTabPosition(this,tabsBar)
                let classSelectorForNext = null

                if( tabsBar.children.length == 1){
                    classSelectorForNext = null
                }else if( tabPosition == 0){
                    classSelectorForNext = tabsBar.children[1].getAttribute("classSelector")
                }else{
                    classSelectorForNext = tabsBar.children[tabPosition-1].getAttribute("classSelector")
                }

                event.dataTransfer.setData(
                    "classSelectorForNext", 
                    classSelectorForNext
                )
            },
            focusTab(){
                tabState.emit('focusedMe')
            },
            closeTab(e){
                e.stopPropagation()

                tabState.emit('close')
            },
            showCross(e){
                toggleCross(this.children[1].children[0],1)
            },
            hideCross(e){
                toggleCross(this.children[1].children[0],0)
            }
        },
        events:{
            mounted(target){
                target.directory = directory

                tabState.on('focusedMe',()=>{
                    RunningConfig.data.focusedTab = target
                    unfocusTabs(target)
                    target.focusEditor()

                    target.props.active = true
                })

                tabState.on('unfocusedMe',()=>{
                    target.props.active = false
                })

                tabState.on('savedMe',()=>{
                	if(!target.props.saved){
                    	isSaved(target,true)
                    	target.props.saved = true
                    	RunningConfig.emit('aTabHasBeenSaved',{
                        	tabElement:this,
                          	path:directory,
                          	parentFolder
                        })
                    }
                })

                tabState.on('unsavedMe',()=>{
                    if(target.props.saved){
                      isSaved(target,false)
                      target.props.saved = false
                      RunningConfig.emit('aTabHasBeenUnSaved',{
                        tabElement:this,
                        path:directory,
                        parentFolder
                      })
                    }
                })

                tabState.on('changePanel',(newPanel)=>{
                    tabState.data.panel = newPanel
                    unfocusTabs(target)
                })

                tabState.on('close',(newPanel)=>{
                  if(this.props.saved){
                  	if( RunningConfig.data.focusedTab == this) focusATab(this)
                    TabComp.node.remove()
                    TabEditorComp.node.remove(); 
                  }  
                })

                unfocusTabs(target)

                RunningConfig.data.focusedTab = target
                target.props.active = tabState.data.active
                target.props.saved = tabState.data.saved
                target.props.state = tabState
                target.isSaved = true
            }
        },
        props:["active"]
    })

    puffin.render(TabComp,panel.children[0])

    const TabEditorComp = puffin.element(`
        <TabEditor/>
    `,{
        components:{
            TabEditor
        },
        events:{
            mounted(target){
                tabState.on('focusedMe',()=>{
                    target.style.display = "block"
                    target.props.state = tabState
                })
                tabState.on('unfocusedMe',()=>{
                    target.style.display = "none"
                    target.props.state = tabState
                })

                tabState.on('changePanel',(newPanel)=>{
                    newPanel.children[1].appendChild(target)
                })

                target.props.state = tabState
            }
        }
    })

    puffin.render(TabEditorComp,panel.children[1])

    return {
        tabElement:TabComp.node,
        bodyElement:TabEditorComp.node,
        tabState,
        isCancelled:false
    }
}

function toggleCross(target,state){
    target.style.opacity = state
}

function isSaved(element,isSaved,directory){
    if( isSaved ){
        element.isSaved = true
        saveFile(element,()=>{
            element.children[1].children[0].style.display = "block"

            if( element.children[1].children[1]!=null )
                element.children[1].children[1].remove()

            RunningConfig.emit('tabSaved',{
                element:element,
                parentFolder:element.props.state.data.parentFolder
            })
            
        })
    }else if(element.isSaved != false){
        element.isSaved = false
        element.children[1].children[0].style.display = "none"

        const comp = puffin.element(`
            <UnSavedIcon/>
        `,{
            components:{
                UnSavedIcon
            }
        })

        puffin.render(comp,element.children[1],{
            removeContent:false
        })
    } 
}

function saveFile(tab,callback){
    
    const  { client, instance } = RunningConfig.data.focusedEditor

    fs.writeFile(tab.directory, client.do('getValue',instance), function(err) {
        if(err) {
            return console.log(err);
        }
        callback()
    }); 
}

function unfocusTabs(tab){
    const tabsBar = tab.parentElement;
    const tabsBarChildren = tabsBar.children;

    for( let otherTab of tabsBarChildren){
        if( otherTab != tab ) {
            otherTab.props.state.emit('unfocusedMe')
        }
    }
}

function focusATab(tab){
    const tabsBar = tab.parentElement;
    const tabsBarChildren = tabsBar.children;

    const position = (function(){
        for( let tabIndex =0; tabIndex < tabsBarChildren.length;tabIndex++){
            if( tabsBarChildren[tabIndex] == tab ) return tabIndex
        }
    })()

    if( position === 0 ){
        if( tabsBarChildren.length > 1 ){
            tabsBarChildren[position+1].props.state.emit('focusedMe')
        }else{
            RunningConfig.data.focusedTab = null
            RunningConfig.data.focusedEditor = null
        }
    }else{
        tabsBarChildren[position-1].props.state.emit('focusedMe')
    }
}

export default Tab