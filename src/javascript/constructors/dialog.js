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
        <div id="${randomSelector}" class="window ${puffin.style.css`
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
				<div>
                  <H2>${title}</H2>
                  <Text>${content}</Text>
				</div>
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
            mounted(){
                if(component != null){
                    puffin.render(component,this.children[1].children[0])
                }
                window.addEventListener('keydown',(e)=>{
                    if(e.keyCode === 27){
                        closeDialog(DialogComp)
                    }
                })
            }
        },
        methods:computedMethods
    })

    return {
        launch:()=> launchDialog(DialogComp),
        close:()=> closeDialog(DialogComp)
    }
}

function launchDialog(DialogComp){
    puffin.render(DialogComp,document.getElementById("windows"))
}

function closeDialog(DialogComp){
    DialogComp.node.remove()
}

export default Dialog