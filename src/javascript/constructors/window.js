import {puffin} from '@mkenzo_8/puffin'
import WindowBody  from '../components/window/window'
import WindowBackground  from '../components/window/background'

function Window({
    component,
    height = "75%",
    width = "80%"
}){
    const randomID = Math.random()
    const WindowComponent = puffin.element(`
        <div id="${randomID}" class="${puffin.style.css`
            &{
                min-height:100%;
                min-width:100%;
                position:fixed;
                top:50%;
                left:50%;
                transform:translate(-50%,-50%);

            }
        `}">
            <WindowBackground window="${randomID}"/>
            <WindowBody style="height:${height};width:${width};">
                <component/>
            </WindowBody>
        </div>
    `,{
        components:{
            WindowBody,
            WindowBackground,
            component
        },
        events:{
            mounted(){
                window.addEventListener('keydown',(e)=>{
                    if(e.keyCode === 27){
                        close(WindowComponent)
                    }
                })
            }
        }
    })

    return {
        launch:()=> launch(WindowComponent),
        close:()=> close(WindowComponent)
    }
}

function launch(WindowComponent){
    puffin.render(WindowComponent,document.getElementById("windows"))
}

function close(WindowComponent){
    WindowComponent.node.remove()
}

export default Window