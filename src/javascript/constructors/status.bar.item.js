import { puffin } from '@mkenzo_8/puffin'
import StatusBarItemBody from '../components/status.bar/status.bar.item'
import RunningConfig from '../utils/running.config'

function StatusBarItem({
    label,
    component,
    action,
    position,
    hint=""
}){
    if( component != null ){
        label = `<component/>`
    } 
    const ItemComponent = puffin.element(`
        <StatusBarItemBody title="${hint}" click="$action">
            ${label}
        </StatusBarItemBody>
    `,{
        methods:{
            action
        },
        components:{
            StatusBarItemBody,
            component
        }
    })

    if(document.getElementById('statusBar')!=null){
        const side = document.getElementById('statusBar').children[position=='right'?1:0]
        puffin.render(ItemComponent,side)
    }else{
        RunningConfig.on("appLoaded",()=>{
            const side = document.getElementById('statusBar').children[position=='right'?1:0]
            puffin.render(ItemComponent,side)
        })
    }
    

    return {
        setHint:(value)=>setHint(ItemComponent.node,value),
        setLabel:(value)=>setLabel(ItemComponent.node,value),
        show:()=>ItemComponent.node.style.display = "block",
        hide:()=>ItemComponent.node.style.display = "none",
        isHidden:()=>ItemComponent.node.style.display == "none"
    }
}

function setHint(element,value){
    element.setAttribute("title",value)
}

function setLabel(element,value){
    element.textContent = value
}

export default StatusBarItem