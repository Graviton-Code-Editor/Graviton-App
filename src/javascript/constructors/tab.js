import TabBody from '../components/panel/tab'
import TabEditor from '../components/panel/tab.editor'
import {puffin} from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import Cross from '../components/icons/cross'

function Tab({
    title,
    isEditor,
    directory,
    component,
    panel = RunningConfig.data.focusedPanel
}){

    const tabState = new puffin.state({
        active:true
    })

    const TabComp = puffin.element(`
        <TabBody click="$focusTab" active="{{active}}" mouseover="$showCross" mouseleave="$hideCross">
            <p>${title}</p>
            <Cross style="opacity:{{crossOpacity}}" click="$closeTab"/>
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

                focusATab(this.parentElement)

                TabComp.node.remove()
                TabEditorComp.node.remove(); 
            },
            showCross(target){
                this.props.crossOpacity = "1"
            },
            hideCross(target){
                this.props.crossOpacity = "0"
            }
        },
        events:{
            mounted(target){
                tabState.changed(function(){
                    target.props.state = tabState
                    target.props.active = tabState.data.active
                })
                target.props.active = tabState.data.active
                target.props.state = tabState
                target.props.crossOpacity = "0"
            }
        },
        props:["active","crossOpacity"]
    })

    puffin.render(TabComp,panel.children[0])

    const TabEditorComp = puffin.element(`
        <TabEditor>
          
        </TabEditor>
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
        bodyElement:TabEditorComp.node
    }
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
        }
    }else{
        children[position-1].props.state.data.active = true
    }
}

export default Tab