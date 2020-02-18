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

    const classSelector = `${directory}`

    if(document.getElementsByClassName(classSelector).length >= 1){
        /**
         *  Tab already exists so it won't be rendered again
         */
        return {
            isCancelled : true
        }
    }

    const TabComp = puffin.element(`
        <TabBody class="${classSelector}" click="$focusTab" active="{{active}}" mouseover="$showCross" mouseleave="$hideCross">
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
                tabState.emit('focusedMe')
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

                tabState.on('focusedMe',()=>{
                    RunningConfig.data.focusedTab = target
                    target.focusEditor()

                    target.props.active = true
                })

                tabState.on('unfocusedMe',()=>{
                    RunningConfig.data.focusedTab = target
                    target.focusEditor()

                    target.props.active = false
                })

                tabState.on('savedMe',()=>{
                    isSaved(target,true)
                    target.props.saved = true
                })

                tabState.on('unsavedMe',()=>{
                    isSaved(target,false)
                    target.props.saved = false
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
                tabState.on('focusedMe',()=>{
                    unfocusTabs(target)
                    target.style.display = "block"
                    target.props.state = tabState
                })
                tabState.on('unfocusedMe',()=>{
                    target.style.display = "none"
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
        panel,
        isCancelled:false
    }
}

function toggleCross(target,state){
    target.style.opacity = state
}

function isSaved(element,isSaved){
    if(isSaved){
        element.isSaved = true
        saveFile(element,()=>{
            element.children[1].children[0].style.display = "block"
            if(element.children[1].children[1]!=null)
                element.children[1].children[1].remove()
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
        if(tab != element) tab.props.state.emit('unfocusedMe')
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
            children[position+1].props.state.emit('focusedMe')
        }else{
            RunningConfig.data.focusedEditor = null
        }
    }else{
        children[position-1].props.state.emit('focusedMe')
    }
}

export default Tab