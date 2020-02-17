import TabBody from '../components/panel/tab'
import TabEditor from '../components/panel/tab.editor'
import {puffin} from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import Cross from '../components/icons/cross'
import UnSavedIcon from '../components/icons/file.not.saved'
import requirePath from '../utils/require'

const fs = requirePath("fs-extra")

function Tab({
    title,
    isEditor,
    directory,
    component,
    panel = RunningConfig.data.focusedPanel
}){

    const tabState = new puffin.state({
        active:true,
        saved:true
    })

    const TabComp = puffin.element(`
        <TabBody click="$focusTab" active="{{active}}" mouseover="$showCross" mouseleave="$hideCross">
            <p>${title}</p>
            <div>
                <Cross style="opacity:0;" click="$closeTab"/>
            </div>
        </TabBody>
    `,{
        components:{
            TabBody,
            Cross
        },
        methods:{
            focusTab(){
                tabState.data.active = true
            },
            closeTab(e){
                e.stopPropagation()

                focusATab(this.parentElement.parentElement)

                TabComp.node.remove()
                TabEditorComp.node.remove(); 
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
                tabState.changed(function(){
                    target.props.state = tabState
                    if(tabState.data.active){
                        RunningConfig.data.focusedTab = target
                        target.focusEditor()
                    }
                    target.props.active = tabState.data.active

                    if( target.props.saved != tabState.data.saved){
                        target.props.saved = tabState.data.saved
                        isSaved(target,target.props.saved)
                    }
                })
                RunningConfig.data.focusedTab = target
                target.props.active = tabState.data.active
                target.props.saved = tabState.data.saved
                target.props.state = tabState

            }
        },
        props:["active"]
    })

    puffin.render(TabComp,panel.children[0])

    const TabEditorComp = puffin.element(`
        <TabEditor></TabEditor>
    `,{
        components:{
            TabEditor
        },
        events:{
            mounted(target){
                tabState.changed(function(){
                    if(tabState.data.active){
                        unfocusTabs(target)
                        target.style.display = "block"
                    }else{
                        target.style.display = "none"
                    }
                    target.props.state = tabState
                })
                unfocusTabs(target)
                target.props.state = tabState
            }
        }
    })

    puffin.render(TabEditorComp,panel.children[1])

    return {
        tabElement:TabComp.node,
        bodyElement:TabEditorComp.node,
        panel
    }
}

function toggleCross(target,state){
    target.style.opacity = state
}

function isSaved(element,state){
    if(state){
        saveFile(element,()=>{
            element.children[1].children[0].style.display = "block"
            if(element.children[1].children[1]!=null)
                element.children[1].children[1].remove()
        })
    }else{
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

function saveFile(target,callback){
    
    const  { client, instance } = RunningConfig.data.focusedEditor

    fs.writeFile(target.directory, client.do('getValue',instance), function(err) {
        if(err) {
            return console.log(err);
        }
        callback()
    }); 
}

function unfocusTabs(element){
    for( let tab of element.parentElement.children){
        if(tab != element) tab.props.state.data.active = false
    }
}

function focusATab(element){

    const parent = element.parentElement;
    const children = parent.children;

    const position = (function(){
        for( let tabIndex =0; tabIndex < children.length;tabIndex++){
            if(children[tabIndex] == element) return tabIndex
        }
    })()

    if(position === 0){
        if(children.length > 1){
            children[position+1].props.state.data.active = true
        }else{
            RunningConfig.data.focusedEditor = null
        }
    }else{
        children[position-1].props.state.data.active = true
    }
}

export default Tab