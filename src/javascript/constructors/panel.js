import PanelBody from '../components/panel/panel'
import { puffin } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import ContextMenu from './contextmenu'

function guessTabPosition(tab,tabsbar){
    const res =Object.keys(tabsbar.children).filter((tabChildren,index)=>{
        if( tabsbar.children[tabChildren] == tab ){
            return tabChildren
        }
    })[0]
    return Number(res)
}

function Panel(){
    const randomSelector = Math.random()
    const PanelComp = puffin.element(`
        <div id="${randomSelector}" click="$focusPanel" contextmenu="$contextmenu" class="${
            puffin.style.css`
                &{
                    flex:1;
                    min-width:1px;
                    overflow:hidden;
                    max-height:100%;
                    min-height:100%;
                    display:flex;
                    flex-direction:column;
                    border-left:1px solid rgba(150,150,150);
                }

                & .tabsbar{
                    min-height:40px;
                    max-height:40px;
                    white-space:nowrap;
                    display:flex;
                    flex:1;
                    overflow-x:auto;
                    overflow-y:hidden;
                    background:var(--tabsbarBackground);
                }
                & .tabsbar:empty{
                    background:transparent;
                }
            `
        }">    
            <div dragover="$allowDrop" drop="$onTabDropped" class="tabsbar"/>
            <PanelBody/>
        </div>
    `,{
        components:{
            PanelBody
        },
        methods:{
            allowDrop(e){
                e.preventDefault();
            },
            onTabDropped(e){
                const target = document.getElementsByClassName(
                    e.target.getAttribute("classSelector")
                )[0] || e.target
                
                const movingTab = document.getElementsByClassName(
                    e.dataTransfer.getData("classSelector")
                )[0]
                const nextOldTab = document.getElementsByClassName(
                    e.dataTransfer.getData("classSelectorForNext")
                )[0]
                let nextTab = null
                let tabsBar = null
                let oldPanel = movingTab.props.state.data.panel
                let panel = null
                let position = 0

                if(target.classList.contains("tabsbar")){
                    tabsBar = target
                    position = tabsBar.children.length-1
                    panel = tabsBar.parentElement
                }else{ 
                    tabsBar=target.parentElement
                    panel = tabsBar.parentElement
                    const targetPosition = guessTabPosition(target,tabsBar)
                    const draggingTabPosition = guessTabPosition(movingTab,tabsBar)

                    if( targetPosition < draggingTabPosition ){
                        nextTab = tabsBar.children[targetPosition]
                    }else{
                        nextTab = tabsBar.children[targetPosition+1]
                    }

                }

                if(position == tabsBar.children.length-1){
                    tabsBar.appendChild(movingTab) //Drag targeting the tabs bar
                }else{
                    tabsBar.insertBefore(movingTab,nextTab) //Drag between tabs
                }
                
                movingTab.props.state.emit('changePanel',(panel)) //Make dragged tab the active one in the new panel and also move the editor 
                if( oldPanel != panel && nextOldTab != null ) {
                    nextOldTab.props.state.emit('focusedMe') //Focus a tab in old panel
                }
            },
            focusPanel(){
                RunningConfig.data.focusedPanel = this
            },
            contextmenu(event){
                new ContextMenu({
                    list:[
                        {
                            label:'Close',
                            action:()=>{
                                removePanel(this)
                            }
                        }
                    ],
                    event,
                    parent:this.parentElement
                })
            }
        }
    })

    puffin.render(PanelComp,document.getElementById("mainpanel"))

    RunningConfig.data.focusedPanel = document.getElementById(randomSelector)

    return {
        element:document.getElementById(randomSelector)
    }
}

function focusOtherPanel(currentPanel){
    const panelParent = currentPanel.parentElement;
    const parentChildren = panelParent.children;

    const position = (function(){
        for( let panelIndex = 0; panelIndex < parentChildren.length;panelIndex++){
            if(parentChildren[panelIndex] == currentPanel) return panelIndex
        }
    })()

    if(parentChildren.length !== 1){
        if(position === 0){
            if(parentChildren.length > 1){
                RunningConfig.data.focusedPanel = parentChildren[position+1]
                return {
                    oldPanel:currentPanel
                }
            }else{
                RunningConfig.data.focusedEditor = null
                return {
                    oldPanel:null
                }
            }
        }else{
            RunningConfig.data.focusedPanel = parentChildren[position-1]
            return {
                oldPanel:currentPanel
            }
        }
    }
    return {
        oldPanel:null
    }
    
}

function removePanel(panelToRemove = RunningConfig.data.focusedPanel){
    
    if( checkIfThereAreTabsUnSaved(panelToRemove) ){

        const { oldPanel } = focusOtherPanel(panelToRemove)
        if( oldPanel != null ) oldPanel.remove()

    }
}

function checkIfThereAreTabsUnSaved(panel){
    const tabsBar = panel.children[0]
    const panelTabs = tabsBar.childNodes

    let allTabsAreSaved = true;

    panelTabs.forEach(function(tab){
        if(!tab.isSaved) return allTabsAreSaved = false
    })

    return allTabsAreSaved
}


export { 
    Panel,
    removePanel
}