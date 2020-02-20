import PanelBody from '../components/panel/panel'
import {puffin} from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import ThemeProvider from 'ThemeProvider'

function Panel(){
    const randomSelector = Math.random()
    const PanelComp = puffin.element(`
        <div id="${randomSelector}" click="$focusPanel" class="${
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
            `
        }">    
            <div class="tabsbar ${
                puffin.style.css`
                    ${ThemeProvider}
                    &{
                        min-height:40px;
                        max-height:40px;
                        white-space:nowrap;
                        display:flex;
                        flex:1;
                        overflow-x:auto;
                        background:{{tabsbarBackground}};
                    }
                    &:empty{
                        background:transparent;
                    }
                `
            }"></div>
            <PanelBody/>
        </div>
    `,{
        components:{
            PanelBody
        },
        methods:{
            focusPanel(){
                RunningConfig.data.focusedPanel = this
            }
        }
    })

    puffin.render(PanelComp,document.getElementById("mainpanel"))

    RunningConfig.data.focusedPanel = document.getElementById(randomSelector)

    return {
        element:document.getElementById(randomSelector)
    }
}

function focusOtherPanel(target){
    const oldPanel = RunningConfig.data.focusedPanel
    const panelParent = target.parentElement;
    const parentChildren = panelParent.children;

    const position = (function(){
        for( let panelIndex = 0; panelIndex < parentChildren.length;panelIndex++){
            if(parentChildren[panelIndex] == target) return panelIndex
        }
    })()

    if(parentChildren.length !== 1){
        if(position === 0){
            if(parentChildren.length > 1){
                RunningConfig.data.focusedPanel = parentChildren[position+1]
                return {
                    oldPanel
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
                oldPanel
            }
        }
    }
    return {
        oldPanel:null
    }
    
}

function removePanel(){
    if(checkIfThereAreTabsUnSaved(RunningConfig.data.focusedPanel)){
        const { oldPanel } = focusOtherPanel(RunningConfig.data.focusedPanel)

    if(oldPanel != null) oldPanel.remove()
    }

    

}

function checkIfThereAreTabsUnSaved(panel){
    const tabsBar = panel.children[0]
    const panelTabs = tabsBar.childNodes

    let _allTabsAreSaved = true;

    panelTabs.forEach(function(tab){
        if(!tab.isSaved) return _allTabsAreSaved = false
    })

    return _allTabsAreSaved
}


export { 
    Panel,
    removePanel
}