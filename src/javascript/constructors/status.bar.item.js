import { puffin } from '@mkenzo_8/puffin'
import StatusBarItemBody from '../components/status.bar/status.bar.item'
import RunningConfig from '../utils/running.config'

function StatusBarItem({
    label,
    action,
    position,
    hint=""
}){
    const component = puffin.element(`
        <StatusBarItemBody title="${hint}" click="$action">
            ${label}
        </StatusBarItemBody>
    `,{
        methods:{
            action
        },
        components:{
            StatusBarItemBody
        }
    })

    if(document.getElementById('statusBar')!=null){
        const side = document.getElementById('statusBar').children[position=='right'?1:0]
        puffin.render(component,side)
    }else{
        
        RunningConfig.on("appLoaded",()=>{
            const side = document.getElementById('statusBar').children[position=='right'?1:0]
            puffin.render(component,side)
        })
    }
    

    return {
        setHint:(value)=>setHint(component.node,value),
        setLabel:(value)=>setLabel(component.node,value),
        show:()=>component.node.style.display = "block",
        hide:()=>component.node.style.display = "none",
        isHidden:()=>component.node.style.display == "none"
    }
}

function setHint(element,value){
    element.setAttribute("title",value)
}

function setLabel(element,value){
    element.textContent = value
}

export default StatusBarItem