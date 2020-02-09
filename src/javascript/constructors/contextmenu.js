import { puffin } from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

const ContextWrapper = puffin.style.div`
    ${ThemeProvider}
    &{
        background:white;
        padding:5px;
        position:fixed;
        color:white;
        border-radius:5px;
        box-shadow:0px 0px 3px rgba(0,0,0,0.2);
    }
    & button{
        background:{{contextmenuButtonBackground}};
        color:{{contextmenuButtonText}};
        border:0;
        padding:6px;
        outline:0;
        border-radius:5px;
    }
    & button:hover{
        background:{{contextmenuButtonHoveringBackground}};
        color:{{contextmenuButtonHoveringText}};
    }

    `

function ContextMenu({
    list,
    parent,
    event
}){
    const randomID = Math.random()
    const contextMenusCreated = document.getElementsByClassName("contextMenu");
    const computedMethods = {...list.map(a=>a.action)}
    if(contextMenusCreated.length != 0) {
        contextMenusCreated[0].remove()
    }
    const ContextComponent = puffin.element(`
            <ContextWrapper id="${randomID}" class="contextMenu" style="top:${event.pageY}px; left:${event.pageX};">
                ${(function(){
                    let content = "";
                        list.map((option,index)=>{
                            content += `<button click="$${index}">${option.label}</button>`
                        })
                    return content
                })()}
            </ContextWrapper>
        `,{
            methods:computedMethods,
            components:{
                ContextWrapper
            },
            events:{
                mounted(target){
                    parent.setAttribute("hasContext","true")
                    window.addEventListener("click",(e)=>{
                        target.remove()
                    })
                    window.addEventListener("contextmenu",(e)=>{
                        e.stopPropagation()
                        
                    })
                }
            }
        })
        puffin.render(ContextComponent,document.body) 
}

export default ContextMenu