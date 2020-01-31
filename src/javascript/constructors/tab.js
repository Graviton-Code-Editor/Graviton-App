import TabBody from '../components/panel/tab'
import TabEditor from '../components/panel/tab.editor'
import {puffin} from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'

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
        <TabBody click="$focusTab" active="{{active}}">
            <p>${directory}</p>
        </TabBody>
    `,{
        components:{
            TabBody
        },
        methods:{
            focusTab(){
                tabState.data.active = true
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
            }
        },
        props:["active"]
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
                        unfocusBrothers(target)
                        target.style.display = "block"
                    }else{
                        target.style.display = "none"
                    }
                    target.props.state = tabState
                })
                unfocusBrothers(target)
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

function unfocusBrothers(element){
    for( let brother of element.parentElement.children){
        if(brother != element) brother.props.state.data.active = false
    }
}

export default Tab