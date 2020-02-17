import DialogBody from '../components/dialog/dialog'
import WindowBackground  from '../components/window/background'
import {puffin} from '@mkenzo_8/puffin'
import { Titles, Text, Button } from '@mkenzo_8/puffin-drac'

function Dialog({
    title = 'Title',
    content = "",
    component,
    buttons = []
}){
    const randomSelector = Math.random()
    const computedMethods = {...buttons.map(btn=>btn.action)}
    const DialogComp = puffin.element(`
        <div id="${randomSelector}" class="${puffin.style.css`
            &{
                min-height:100%;
                min-width:100%;
                position:fixed;
                top:50%;
                left:50%;
                transform:translate(-50%,-50%);
            }
        `}">
            <WindowBackground window="${randomSelector}"/>
            <DialogBody>
                <H2>${title}</H2>
                <Text>${content}</Text>
                <div>
                    ${(function(){
                        let content = "";
                        buttons.map(function(btn,index){
                            content += `<Button click="$${index}" onclick="document.getElementById('${randomSelector}').remove()">${btn.label}</Button>`
                        })
                        return content
                    })()}
                </div>
            </DialogBody>
        </div>
    `,{
        components:{
            DialogBody,
            WindowBackground,
            H2:Titles.h2,
            Text,
            Button
        },
        events:{
            mounted(target){
                if(component != null){
                    puffin.render(component,target.children[1].children[1])
                }
                window.addEventListener('keydown',(e)=>{
                    if(e.keyCode === 27){
                        close(DialogComp)
                    }
                })
            }
        },
        methods:computedMethods
    })

    
    puffin.render(DialogComp,document.getElementById("windows"))
    return {
        close:()=> close(DialogComp)
    }
}

function close(DialogComp){
    DialogComp.node.remove()
}

export default Dialog